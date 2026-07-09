import { Inject, Injectable } from '@nestjs/common';

import {
  AuthProvider,
  User,
} from '../../../domain/entities/user.entity';

import {
  USER_REPOSITORY,
} from '../../../domain/repositories/token';

import type { IUserRepository } from '../../../domain/repositories/user.repository';

import {
  GOOGLE_AUTH_SERVICE,
 
} from '../interfaces/google-auth.interface';
import type {
  
  IGoogleAuthService,
} from '../interfaces/google-auth.interface';

import { GoogleLoginDto } from '../dto/GoogleLoginDto';
import { GenerateLoginResponseUseCase } from './generate-login-response.use-case';

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(GOOGLE_AUTH_SERVICE)
    private readonly googleAuthService: IGoogleAuthService,

    private readonly generateLoginResponseUseCase: GenerateLoginResponseUseCase,
  ) {}

  async execute(dto: GoogleLoginDto) {
    const googleUser =
      await this.googleAuthService.verifyIdToken(dto.idToken);

    let user =
      await this.userRepository.findByEmail(
        googleUser.email,
      );

    if (!user) {
      user = await this.userRepository.create(
        new User(
          null,
          googleUser.name,
          googleUser.email,
          null,
          true,
          AuthProvider.GOOGLE,
          googleUser.googleId,
        ),
      );
    }

    return this.generateLoginResponseUseCase.execute(
      user,
    );
  }
}