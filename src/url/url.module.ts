import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UrlSchema, UrlSchemaFactory } from './schemas/url.schema';

import { URL_REPOSITORY } from './constants/injection-tokens';

import { UrlRepository } from './repositories/url.repository';

import { UrlService } from './url.service';
import { UrlController } from './url.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UrlSchema.name, schema: UrlSchemaFactory },
    ]),
  ],

  controllers: [UrlController],

  providers: [
    {
      provide: URL_REPOSITORY,
      useClass: UrlRepository,
    },
    UrlService,
  ],

  exports: [UrlService],
})
export class UrlModule {}
