import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema, UserSchemaFactory } from './schemas/user.schema';
import { OtpSchema, OtpSchemaFactory } from './schemas/otp.schema';
import { RefreshTokenSchema, RefreshTokenSchemaFactory } from './schemas/refresh-token.schema';

import { USER_REPOSITORY, OTP_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from './constants/injection-tokens';
import { TOKEN_HASHER } from './interfaces/token-hasher.interface';
import { GOOGLE_AUTH_SERVICE } from './interfaces/google-auth.interface';
import { EMAIL_SERVICE } from './interfaces/email.service.interface';

import { UserRepository } from './repositories/user.repository';
import { OtpRepository } from './repositories/otp.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

import { PasswordHasherService } from './services/password-hasher.service';
import { JwtTokenService } from './services/jwt-token.service';
import { TokenHasherService } from './services/token-hasher.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { MailService } from './services/mail.service';
import { CookieService } from './services/cookie.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

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

    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaFactory },
      { name: OtpSchema.name, schema: OtpSchemaFactory },
      { name: RefreshTokenSchema.name, schema: RefreshTokenSchemaFactory },
    ]),
  ],

  controllers: [AuthController],

  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: OTP_REPOSITORY,
      useClass: OtpRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRepository,
    },
    {
      provide: 'PASSWORD_HASHER',
      useClass: PasswordHasherService,
    },
    {
      provide: 'TOKEN_PROVIDER',
      useClass: JwtTokenService,
    },
    {
      provide: TOKEN_HASHER,
      useClass: TokenHasherService,
    },
    {
      provide: GOOGLE_AUTH_SERVICE,
      useClass: GoogleOAuthService,
    },
    {
      provide: EMAIL_SERVICE,
      useClass: MailService,
    },

    JwtStrategy,
    CookieService,
    AuthService,
  ],

  exports: [AuthService, CookieService],
})
export class AuthModule {}
