import { Body, Controller, Post } from '@nestjs/common';

import { RegisterRequestDto, RegisterResponseDto } from '../../application/auth/dto/register.dto';
import { LoginRequestDto } from '../../application/auth/dto/login.dto';
import { VerifyEmailUseCase } from '../../application/auth/use-cases/verify-email.use-case';
import { RegisterUseCase } from '../../application/auth/use-cases/register.use-case';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { VerifyEmailDto } from 'src/application/auth/dto/verify-email.dto';
import { ResendOtpDto } from '../../application/auth/dto/resend-otp.dto';
import { ResendOtpUseCase } from '../../application/auth/use-cases/resend-otp.use-case';
import { ForgotPasswordDto } from '../../application/auth/dto/forgot-password.dto';
import { ForgotPasswordUseCase } from '../../application/auth/use-cases/forgot-password.use-case';
import { RefreshTokenDto } from '../../application/auth/dto/refresh-token.dto';
import { LogoutDto } from '../../application/auth/dto/logout.dto';

import { RefreshTokenUseCase } from '../../application/auth/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../../application/auth/use-cases/logout.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendOtpUseCase: ResendOtpUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    return this.loginUseCase.execute(dto);
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ) {
    await this.verifyEmailUseCase.execute(dto);

    return {
      message: 'Email verified successfully.',
    };
  }

  @Post('resend-otp')
  async resendOtp(
    @Body() dto: ResendOtpDto,
  ) {
    await this.resendOtpUseCase.execute(dto);

    return {
      message: 'OTP sent successfully.',
    };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ) {
    await this.forgotPasswordUseCase.execute(dto);

    return {
      message:
        'Password reset OTP sent successfully.',
    };
  }


  @Post('refresh-token')
  async refreshToken(
    @Body() dto: RefreshTokenDto,
  ) {
    return this.refreshTokenUseCase.execute(
      dto.refreshToken,
    );
  }

  @Post('logout')
  async logout(
    @Body() dto: LogoutDto,
  ) {
    await this.logoutUseCase.execute(
      dto.refreshToken,
    );

    return {
      message: 'Logged out successfully.',
    };
  }

}