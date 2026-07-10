import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import { UserSchema, UserSchemaFactory } from './schemas/user.schema';
import { OtpSchema, OtpSchemaFactory } from './schemas/otp.schema';
import { RefreshTokenSchema, RefreshTokenSchemaFactory } from './schemas/refresh-token.schema';

// Injection tokens
import { USER_REPOSITORY, OTP_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from './constants/injection-tokens';
import { TOKEN_HASHER } from './interfaces/token-hasher.interface';
import { GOOGLE_AUTH_SERVICE } from './interfaces/google-auth.interface';
import { EMAIL_SERVICE } from './interfaces/email.service.interface';

// Repositories
import { UserRepository } from './repositories/user.repository';
import { OtpRepository } from './repositories/otp.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

// Infrastructure services
import { PasswordHasherService } from './services/password-hasher.service';
import { JwtTokenService } from './services/jwt-token.service';
import { TokenHasherService } from './services/token-hasher.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { MailService } from './services/mail.service';
import { CookieService } from './services/cookie.service';

// Strategy
import { JwtStrategy } from './strategies/jwt.strategy';

// Services
import { RegisterService } from './services/register.service';
import { LoginService } from './services/login.service';
import { GenerateEmailOtpService } from './services/generate-email-otp.service';
import { VerifyEmailService } from './services/verify-email.service';
import { ResendOtpService } from './services/resend-otp.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ResetPasswordService } from './services/reset-password.service';
import { GenerateRefreshTokenService } from './services/generate-refresh-token.service';
import { RotateRefreshTokenService } from './services/rotate-refresh-token.service';
import { LogoutService } from './services/logout.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { GoogleLoginService } from './services/google-login.service';
import { GenerateLoginResponseService } from './services/generate-login-response.service';

// Controller
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
      {
        name: UserSchema.name,
        schema: UserSchemaFactory,
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

  controllers: [
    AuthController,
  ],

  providers: [
    // Repositories
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

    // Infrastructure services
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

    // Business services
    RegisterService,
    LoginService,
    GenerateEmailOtpService,
    VerifyEmailService,
    ResendOtpService,
    ForgotPasswordService,
    ResetPasswordService,
    GenerateRefreshTokenService,
    RotateRefreshTokenService,
    LogoutService,
    RefreshTokenService,
    GoogleLoginService,
    GenerateLoginResponseService,
  ],

  exports: [
    RegisterService,
    LoginService,
    GenerateEmailOtpService,
    VerifyEmailService,
    ResendOtpService,
    ForgotPasswordService,
    ResetPasswordService,
    GenerateRefreshTokenService,
    RotateRefreshTokenService,
    LogoutService,
    RefreshTokenService,
    GoogleLoginService,
    GenerateLoginResponseService,
  ],
})
export class AuthModule {}
