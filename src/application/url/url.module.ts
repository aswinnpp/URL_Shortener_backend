import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../infrastructure/database/database.module';

import { CreateShortUrlUseCase } from './use-cases/create-short-url.use-case';
import { RedirectUrlUseCase } from './use-cases/redirect-url.use-case';

import { UrlController } from '../../interface/controllers/url.controller';

@Module({
  imports: [DatabaseModule],

  controllers: [UrlController],

  providers: [
    CreateShortUrlUseCase,
    RedirectUrlUseCase,
  ],

  exports: [
    CreateShortUrlUseCase,
    RedirectUrlUseCase,
  ],
})
export class UrlModule {}