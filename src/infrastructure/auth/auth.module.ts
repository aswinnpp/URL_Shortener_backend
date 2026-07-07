import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { BcryptService } from './bcrypt.service';
import { JwtTokenService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
  
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN') as `${number}${'s' | 'm' | 'h' | 'd'}`,
        },
      }),
    }),
  ],

  providers: [
    {
      provide: 'PASSWORD_HASHER',
      useClass: BcryptService,
    },
    {
      provide: 'TOKEN_PROVIDER',
      useClass: JwtTokenService,
    },
    JwtStrategy,
  ],

  exports: [
    'PASSWORD_HASHER',
    'TOKEN_PROVIDER',
    JwtModule,
  ],
})
export class AuthInfrastructureModule {}