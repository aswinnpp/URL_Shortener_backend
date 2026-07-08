import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../infrastructure/database/database.module';

import { UrlController } from '../../interface/controllers/url.controller';
import { DeleteUrlUseCase } from './use-cases/delete-url.use-case';
import { CreateShortUrlUseCase } from './use-cases/create-short-url.use-case';
import { RedirectUrlUseCase } from './use-cases/redirect-url.use-case';
import { GetMyUrlsUseCase } from './use-cases/get-my-urls.use-case';
import { GetUrlAnalyticsUseCase } from './use-cases/get-url-analytics.use-case';
import { UpdateUrlUseCase } from './use-cases/update-url.use-case';


@Module({
  imports: [DatabaseModule],

  controllers: [UrlController],

  providers: [
    CreateShortUrlUseCase,
    RedirectUrlUseCase,
    GetMyUrlsUseCase,
    DeleteUrlUseCase,
    GetUrlAnalyticsUseCase,
    UpdateUrlUseCase,
  ],

  exports: [
    CreateShortUrlUseCase,
    RedirectUrlUseCase,
    GetMyUrlsUseCase,
    DeleteUrlUseCase,
    GetUrlAnalyticsUseCase,
    UpdateUrlUseCase,
  ],
})
export class UrlModule {}