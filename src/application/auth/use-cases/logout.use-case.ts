import {
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
  
  @Injectable()
  export class LogoutUseCase {
    constructor(
      @Inject(REFRESH_TOKEN_REPOSITORY)
      private readonly refreshRepository: IRefreshTokenRepository,
  
      @Inject(TOKEN_HASHER)
      private readonly tokenHasher: ITokenHasher,
    ) {}
  
    async execute(
      refreshToken: string,
    ): Promise<void> {
  
      const hash =
        await this.tokenHasher.hash(refreshToken);
  
      await this.refreshRepository.delete(hash);
    }
  }