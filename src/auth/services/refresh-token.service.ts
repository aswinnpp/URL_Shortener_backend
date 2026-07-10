import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { IRefreshTokenRepository } from '../interfaces/refresh-token-repository.interface';
import type { IUserRepository } from '../interfaces/user-repository.interface';

import {
  REFRESH_TOKEN_REPOSITORY,
  USER_REPOSITORY,
} from '../constants/injection-tokens';

import {
  TOKEN_HASHER,
} from '../interfaces/token-hasher.interface';

import type {
  ITokenHasher,
} from '../interfaces/token-hasher.interface';

import {
  TOKEN_PROVIDER,
} from '../interfaces/token-provider.interface';

import type {
  ITokenProvider,
} from '../interfaces/token-provider.interface';

import { GenerateRefreshTokenService } from './generate-refresh-token.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshRepository: IRefreshTokenRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: ITokenHasher,

    @Inject(TOKEN_PROVIDER)
    private readonly tokenProvider: ITokenProvider,

    private readonly generateRefreshTokenService: GenerateRefreshTokenService,
  ) {}

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token is missing.',
      );
    }

    const hash =
      await this.tokenHasher.hash(refreshToken);

    const stored =
      await this.refreshRepository.findByHash(hash);

    if (!stored) {
      throw new BadRequestException(
        'Invalid refresh token.',
      );
    }

    const user =
      await this.userRepository.findById(
        stored.userId,
      );

    if (!user) {
      throw new UnauthorizedException(
        'User not found.',
      );
    }

    await this.refreshRepository.delete(hash);

    const newRefreshToken =
      await this.generateRefreshTokenService.generate(
        user.id!,
      );

    const accessToken =
      await this.tokenProvider.generateAccessToken({
        sub: user.id,
        email: user.email,
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id!,
          name: user.name,
          email: user.email,
        },
      };
  }
}
