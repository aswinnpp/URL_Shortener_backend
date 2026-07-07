import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema, UserSchemaFactory } from './schemas/user.schema';
import { UrlSchema, UrlSchemaFactory } from './schemas/url.schema';

import { UserRepositoryImpl } from './repositories/user.repository.impl';
import { UrlRepositoryImpl } from './repositories/url.repository.impl';

import {
  USER_REPOSITORY,
  URL_REPOSITORY,
} from '../../domain/repositories/token';

@Module({
  imports: [
    ConfigModule,

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    MongooseModule.forFeature([
      {
        name: UserSchema.name,
        schema: UserSchemaFactory,
      },
      {
        name: UrlSchema.name,
        schema: UrlSchemaFactory,
      },
    ]),
  ],

  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    {
      provide: URL_REPOSITORY,
      useClass: UrlRepositoryImpl,
    },
  ],

  exports: [
    USER_REPOSITORY,
    URL_REPOSITORY,
  ],
})
export class DatabaseModule {}