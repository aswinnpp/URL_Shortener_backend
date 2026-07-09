import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../infrastructure/database/database.module';
import { AuthInfrastructureModule } from '../../infrastructure/auth/auth.module';
import { GenerateEmailOtpUseCase } from './use-cases/generate-email-otp.use-case';
import { RegisterUseCase } from './use-cases/register.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { VerifyEmailUseCase } from './use-cases/verify-email.use-case';
import { AuthController } from '../../interface/controllers/auth.controller';
import { ResendOtpUseCase } from './use-cases/resend-otp.use-case';
import { ForgotPasswordUseCase } from './use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './use-cases/reset-password.use-case';
import { GenerateRefreshTokenUseCase } from './use-cases/generate-refresh-token.use-case';
import { RotateRefreshTokenUseCase } from './use-cases/rotate-refresh-token.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { EmailModule } from '../../infrastructure/email/email.module';
import { GoogleLoginUseCase } from './use-cases/google-login.use-case.ts';
import { GenerateLoginResponseUseCase } from './use-cases/generate-login-response.use-case';

@Module({
  imports: [    
    DatabaseModule,
    AuthInfrastructureModule,
    EmailModule,
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    RegisterUseCase,
    LoginUseCase,
    GenerateEmailOtpUseCase,
    VerifyEmailUseCase,
    ResendOtpUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    GenerateRefreshTokenUseCase,
    RotateRefreshTokenUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    GenerateEmailOtpUseCase,
    GoogleLoginUseCase,
    GenerateLoginResponseUseCase,
  ],

  exports: [
    RegisterUseCase,
    LoginUseCase, 
    GenerateEmailOtpUseCase,
    VerifyEmailUseCase,
    ResendOtpUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    GenerateRefreshTokenUseCase,
    RotateRefreshTokenUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    GenerateEmailOtpUseCase,
    GoogleLoginUseCase,
    GenerateLoginResponseUseCase,
  ],
})
export class AuthModule {}