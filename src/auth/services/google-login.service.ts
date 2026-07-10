import { Inject, Injectable } from '@nestjs/common';

import {
  AuthProvider,
  User,
} from '../../entities/user.entity';

import {
  USER_REPOSITORY,
} from '../constants/injection-tokens';

import type { IUserRepository } from '../interfaces/user-repository.interface';

import {
  GOOGLE_AUTH_SERVICE,
} from '../interfaces/google-auth.interface';
import type {
  IGoogleAuthService,
} from '../interfaces/google-auth.interface';

import { GoogleLoginDto } from '../dto/google-login.dto';
import { GenerateLoginResponseService } from './generate-login-response.service';

@Injectable()
export class GoogleLoginService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(GOOGLE_AUTH_SERVICE)
    private readonly googleAuthService: IGoogleAuthService,

    private readonly generateLoginResponseService: GenerateLoginResponseService,
  ) {}

  async login(dto: GoogleLoginDto) {
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

    return this.generateLoginResponseService.generate(
      user,
    );
  }
}
