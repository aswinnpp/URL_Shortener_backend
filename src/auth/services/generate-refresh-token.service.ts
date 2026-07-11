import { randomBytes } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';

import { RefreshToken } from '../entities/refresh-token.entity';

import {
  REFRESH_TOKEN_REPOSITORY,
} from '../constants/injection-tokens';

import type { IRefreshTokenRepository } from '../interfaces/refresh-token-repository.interface';
import { ConfigService } from '@nestjs/config';
import {
  TOKEN_HASHER,
} from '../interfaces/token-hasher.interface';

import type {
  ITokenHasher,
} from '../interfaces/token-hasher.interface';

@Injectable()
export class GenerateRefreshTokenService {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: ITokenHasher,
    private readonly configService: ConfigService,
  ) { }

  async generate(userId: string): Promise<string> {
    await this.refreshTokenRepository.deleteByUser(userId);

    const refreshToken = randomBytes(64).toString('hex');

    const tokenHash =
      await this.tokenHasher.hash(refreshToken);

    const expiresInDays =
      this.configService.getOrThrow<number>(
        'REFRESH_TOKEN_EXPIRES_IN_DAYS',
      );

    const expiresAt = new Date(
      Date.now() +
      expiresInDays * 24 * 60 * 60 * 1000,
    );

    await this.refreshTokenRepository.create(
      new RefreshToken(
        null,
        userId,
        tokenHash,
        expiresAt,
      ),
    );

    return refreshToken;
  }
}
