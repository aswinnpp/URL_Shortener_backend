import {
    BadRequestException,
    Inject,
    Injectable,
  } from '@nestjs/common';

  import {
    REFRESH_TOKEN_REPOSITORY,
  } from '../constants/injection-tokens';

  import type { IRefreshTokenRepository } from '../interfaces/refresh-token-repository.interface';

  import {
    TOKEN_HASHER,
  } from '../interfaces/token-hasher.interface';

  import type {
    ITokenHasher,
  } from '../interfaces/token-hasher.interface';

  import { GenerateRefreshTokenService } from './generate-refresh-token.service';

  @Injectable()
  export class RotateRefreshTokenService {
    constructor(
      @Inject(REFRESH_TOKEN_REPOSITORY)
      private readonly refreshRepository: IRefreshTokenRepository,

      @Inject(TOKEN_HASHER)
      private readonly tokenHasher: ITokenHasher,

      private readonly generateRefreshTokenService: GenerateRefreshTokenService,
    ) {}

    async rotate(
      refreshToken: string,
    ): Promise<string> {

      const hash =
        await this.tokenHasher.hash(refreshToken);

      const stored =
        await this.refreshRepository.findByHash(hash);

      if (!stored) {
        throw new BadRequestException(
          'Invalid refresh token',
        );
      }

      await this.refreshRepository.delete(hash);

      return this.generateRefreshTokenService.generate(
        stored.userId,
      );
    }
  }
