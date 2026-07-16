import { Body, Controller, Post, Req, Res } from '@nestjs/common';

import { RegisterRequestDto } from './dto/register.dto';
import { LoginRequestDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';

import type { Request, Response } from 'express';

import { REFRESH_TOKEN_COOKIE } from './constants/cookie.constants';

import { AuthService } from './auth.service';
import { CookieService } from './services/cookie.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    this.cookieService.setAccessToken(res, result.accessToken);
    this.cookieService.setRefreshToken(res, result.refreshToken);

    return { user: result.user };
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.authService.verifyEmail(dto);

    return { message: 'Email verified successfully.' };
  }

  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    await this.authService.resendOtp(dto);

    return { message: 'OTP sent successfully.' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);

    return { message: 'Password reset OTP sent successfully.' };
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

    const result = await this.authService.refreshToken(refreshToken);

    this.cookieService.setAccessToken(res, result.accessToken);
    this.cookieService.setRefreshToken(res, result.refreshToken);

    return { user: result.user };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

    await this.authService.logout(refreshToken);

    this.cookieService.clearAuthCookies(res);

    return { message: 'Logged out successfully.' };
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);

    return { message: 'Password reset successfully.' };
  }

  @Post('google')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.googleLogin(dto);

    this.cookieService.setAccessToken(res, result.accessToken);
    this.cookieService.setRefreshToken(res, result.refreshToken);

    return { user: result.user };
  }
}
