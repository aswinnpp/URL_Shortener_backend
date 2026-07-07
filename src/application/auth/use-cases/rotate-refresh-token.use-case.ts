import {
    BadRequestException,
    Inject,
    Injectable,
  } from '@nestjs/common';
  
  import {
    REFRESH_TOKEN_REPOSITORY,
  } from '../../../domain/repositories/token';
  
  import type { IRefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository';
  
  import {
    TOKEN_HASHER,
  } from '../interfaces/token-hasher.interface';
  
  import type {
    ITokenHasher,
  } from '../interfaces/token-hasher.interface';
  
  import { GenerateRefreshTokenUseCase } from './generate-refresh-token.use-case';
  
  @Injectable()
  export class RotateRefreshTokenUseCase {
    constructor(
      @Inject(REFRESH_TOKEN_REPOSITORY)
      private readonly refreshRepository: IRefreshTokenRepository,
  
      @Inject(TOKEN_HASHER)
      private readonly tokenHasher: ITokenHasher,
  
      private readonly generateRefreshTokenUseCase: GenerateRefreshTokenUseCase,
    ) {}
  
    async execute(
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
  
      return this.generateRefreshTokenUseCase.execute(
        stored.userId,
      );
    }
  }