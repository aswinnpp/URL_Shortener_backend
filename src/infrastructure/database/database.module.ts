import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  OtpSchema,
  OtpSchemaFactory,
} from './schemas/otp.schema';

import { OTP_REPOSITORY } from '../../domain/repositories/token';
import { OtpRepositoryImpl } from './repositories/otp.repository.impl';

import { UserSchema, UserSchemaFactory } from './schemas/user.schema';
import { UrlSchema, UrlSchemaFactory } from './schemas/url.schema';

import {
  RefreshTokenSchema,
  RefreshTokenSchemaFactory,
} from './schemas/refresh-token.schema';

import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/token';

import { RefreshTokenRepositoryImpl } from './repositories/refresh-token.repository.impl';
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
      {
        name: OtpSchema.name,
        schema: OtpSchemaFactory,
      },
      {
        name: RefreshTokenSchema.name,
        schema: RefreshTokenSchemaFactory,
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
    {
      provide: OTP_REPOSITORY,
      useClass: OtpRepositoryImpl,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRepositoryImpl,
    },
  ],

  exports: [
    USER_REPOSITORY,
    URL_REPOSITORY,
    OTP_REPOSITORY,
    REFRESH_TOKEN_REPOSITORY,
    ],
})
export class DatabaseModule {}