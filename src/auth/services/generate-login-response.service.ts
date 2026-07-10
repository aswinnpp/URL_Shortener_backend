import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../entities/user.entity';
import { GenerateRefreshTokenService } from './generate-refresh-token.service';
import type { ITokenProvider } from '../interfaces/token-provider.interface';

@Injectable()
export class GenerateLoginResponseService {
  constructor(
    private readonly generateRefreshTokenService: GenerateRefreshTokenService,

    @Inject('TOKEN_PROVIDER')
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async generate(user: User) {
    const accessToken =
      await this.tokenProvider.generateAccessToken({
        sub: user.id!,
        email: user.email,
      });

    const refreshToken =
      await this.generateRefreshTokenService.generate(
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
