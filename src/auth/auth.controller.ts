import { Body, Controller, Post, Req, Res } from '@nestjs/common';

import { RegisterRequestDto } from './dto/register.dto';
import { LoginRequestDto } from './dto/login.dto';
import { VerifyEmailService } from './services/verify-email.service';
import { RegisterService } from './services/register.service';
import { LoginService } from './services/login.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ResendOtpService } from './services/resend-otp.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordService } from './services/reset-password.service';

import type {
  Request,
  Response,
} from 'express';

import {
  REFRESH_TOKEN_COOKIE,
} from './constants/cookie.constants';

import { CookieService } from './services/cookie.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { GoogleLoginService } from './services/google-login.service';

import { RefreshTokenService } from './services/refresh-token.service';
import { LogoutService } from './services/logout.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly resendOtpService: ResendOtpService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly logoutService: LogoutService,
    private readonly cookieService: CookieService,
    private readonly googleLoginService: GoogleLoginService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    return this.registerService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,

    @Res({ passthrough: true })
    res: Response,
  ) {
    const result =
      await this.loginService.login(dto);

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
    await this.verifyEmailService.verify(dto);

    return {
      message: 'Email verified successfully.',
    };
  }

  @Post('resend-otp')
  async resendOtp(
    @Body() dto: ResendOtpDto,
  ) {
    await this.resendOtpService.resend(dto);

    return {
      message: 'OTP sent successfully.',
    };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ) {
    await this.forgotPasswordService.sendResetOtp(dto);

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
      await this.refreshTokenService.refresh(
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

    await this.logoutService.logout(
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
    await this.resetPasswordService.reset(dto);

    return {
      message: 'Password reset successfully.',
    };
  }

  @Post('google')
  async googleLogin(
    @Body() dto: GoogleLoginDto,

    @Res({ passthrough: true })
    res: Response,
  ) {
    const result =
      await this.googleLoginService.login(dto);

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
}
