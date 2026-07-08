import { Body, Controller, Post, Req, Res, } from '@nestjs/common';

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
import { ResetPasswordDto } from '../../application/auth/dto/reset-password.dto';
import { ResetPasswordUseCase } from '../../application/auth/use-cases/reset-password.use-case';

import type {
  Request,
  Response,
} from 'express';


import {
  REFRESH_TOKEN_COOKIE,
} from '../../infrastructure/auth/cookie.constants';

import { CookieService } from '../../infrastructure/auth/cookie.service';


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
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly cookieService: CookieService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,

    @Res({ passthrough: true })
    res: Response,
  ) {
    const result =
      await this.loginUseCase.execute(dto);

    this.cookieService.setAccessToken(
      res,
      result.accessToken,
    );

    this.cookieService.setRefreshToken(
      res,
      result.refreshToken,
    );

    return {
      user: result.user,
    };
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
    @Req() req: Request,

    @Res({ passthrough: true })
    res: Response,
  ) {
    const refreshToken =
      req.cookies[
      REFRESH_TOKEN_COOKIE
      ];

    const result =
      await this.refreshTokenUseCase.execute(
        refreshToken,
      );

    this.cookieService.setAccessToken(
      res,
      result.accessToken,
    );

    this.cookieService.setRefreshToken(
      res,
      result.refreshToken,
    );

    return {
      user: result.user,
    };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,

    @Res({ passthrough: true })
    res: Response,
  ) {
    const refreshToken =
      req.cookies[
      REFRESH_TOKEN_COOKIE
      ];

    await this.logoutUseCase.execute(
      refreshToken,
    );

    this.cookieService.clearAuthCookies(
      res,
    );

    return {
      message:
        'Logged out successfully.',
    };
  }

  @Post('reset-password')
async resetPassword(
  @Body() dto: ResetPasswordDto,
) {
  await this.resetPasswordUseCase.execute(dto);

  return {
    message: 'Password reset successfully.',
  };
}

}