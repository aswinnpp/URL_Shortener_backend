import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { UrlSchema, UrlSchemaFactory } from './schemas/url.schema';

// Injection token
import { URL_REPOSITORY } from './constants/injection-tokens';

// Repository
import { UrlRepository } from './repositories/url.repository';

// Services
import { CreateShortUrlService } from './services/create-short-url.service';
import { RedirectUrlService } from './services/redirect-url.service';
import { GetMyUrlsService } from './services/get-my-urls.service';
import { DeleteUrlService } from './services/delete-url.service';
import { GetUrlAnalyticsService } from './services/get-url-analytics.service';
import { UpdateUrlService } from './services/update-url.service';

// Controller
import { UrlController } from './url.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UrlSchema.name,
        schema: UrlSchemaFactory,
      },
    ]),
  ],

  controllers: [UrlController],

  providers: [
    {
      provide: URL_REPOSITORY,
      useClass: UrlRepository,
    },
    CreateShortUrlService,
    RedirectUrlService,
    GetMyUrlsService,
    DeleteUrlService,
    GetUrlAnalyticsService,
    UpdateUrlService,
  ],

  exports: [
    CreateShortUrlService,
    RedirectUrlService,
    GetMyUrlsService,
    DeleteUrlService,
    GetUrlAnalyticsService,
    UpdateUrlService,
  ],
})
export class UrlModule {}
