import { randomBytes } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';

import { RefreshToken } from '../../../domain/entities/refresh-token.entity';

import {
  REFRESH_TOKEN_REPOSITORY,
} from '../../../domain/repositories/token';

import type { IRefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository';
import { ConfigService } from '@nestjs/config';
import {
  TOKEN_HASHER,
} from '../interfaces/token-hasher.interface';

import type {
  ITokenHasher,
} from '../interfaces/token-hasher.interface';

@Injectable()
export class GenerateRefreshTokenUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: ITokenHasher,
    private readonly configService: ConfigService,
  ) { }

  async execute(userId: string): Promise<string> {
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