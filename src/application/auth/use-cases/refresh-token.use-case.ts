import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { IRefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository';
import type { IUserRepository } from '../../../domain/repositories/user.repository';

import {
  REFRESH_TOKEN_REPOSITORY,
  USER_REPOSITORY,
} from '../../../domain/repositories/token';

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

import { GenerateRefreshTokenUseCase } from './generate-refresh-token.use-case';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshRepository: IRefreshTokenRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: ITokenHasher,

    @Inject(TOKEN_PROVIDER)
    private readonly tokenProvider: ITokenProvider,

    private readonly generateRefreshTokenUseCase: GenerateRefreshTokenUseCase,
  ) {}

  async execute(refreshToken?: string) {
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
      await this.generateRefreshTokenUseCase.execute(
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
    };
  }
}