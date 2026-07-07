import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './application/auth/auth.module';
import { UrlModule } from './application/url/url.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    DatabaseModule,

    AuthModule,

    UrlModule,
  ],
})
export class AppModule {}