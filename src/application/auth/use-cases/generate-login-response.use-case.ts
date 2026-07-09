import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../../domain/entities/user.entity';
import { GenerateRefreshTokenUseCase } from './generate-refresh-token.use-case';
import type { ITokenProvider } from '../interfaces/token-provider.interface';

@Injectable()
export class GenerateLoginResponseUseCase {
  constructor(
    private readonly generateRefreshTokenUseCase: GenerateRefreshTokenUseCase,

    @Inject('TOKEN_PROVIDER')
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(user: User) {
    const accessToken =
      await this.tokenProvider.generateAccessToken({
        sub: user.id!,
        email: user.email,
      });

    const refreshToken =
      await this.generateRefreshTokenUseCase.execute(
        user.id!,
      );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
      },
    };
  }
}