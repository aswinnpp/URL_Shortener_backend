import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

import { AuthProvider, User } from './schemas/user.schema';
import { Otp } from './schemas/otp.schema';
import { RefreshToken } from './schemas/refresh-token.schema';

import type { IUserRepository } from './interfaces/user-repository.interface';
import type { IOtpRepository } from './interfaces/otp-repository.interface';
import type { IRefreshTokenRepository } from './interfaces/refresh-token-repository.interface';
import { USER_REPOSITORY, OTP_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from './constants/injection-tokens';

import type { IPasswordHasher } from './interfaces/password-hasher.interface';
import type { ITokenProvider } from './interfaces/token-provider.interface';
import type { ITokenHasher } from './interfaces/token-hasher.interface';
import { TOKEN_HASHER } from './interfaces/token-hasher.interface';
import { GOOGLE_AUTH_SERVICE } from './interfaces/google-auth.interface';
import type { IGoogleAuthService } from './interfaces/google-auth.interface';
import { EMAIL_SERVICE } from './interfaces/email.service.interface';
import type { IEmailService } from './interfaces/email.service.interface';

import type { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import type { LoginRequestDto } from './dto/login.dto';
import type { VerifyEmailDto } from './dto/verify-email.dto';
import type { ResendOtpDto } from './dto/resend-otp.dto';
import type { ForgotPasswordDto } from './dto/forgot-password.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';
import type { GoogleLoginDto } from './dto/google-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(OTP_REPOSITORY)
    private readonly otpRepository: IOtpRepository,

    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @Inject('PASSWORD_HASHER')
    private readonly passwordHasher: IPasswordHasher,

    @Inject('TOKEN_PROVIDER')
    private readonly tokenProvider: ITokenProvider,

    @Inject(TOKEN_HASHER)
    private readonly tokenHasher: ITokenHasher,

    @Inject(GOOGLE_AUTH_SERVICE)
    private readonly googleAuthService: IGoogleAuthService,

    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,

    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser?.isVerified) {
      throw new ConflictException('Email already exists.');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    let savedUser: User;

    if (existingUser) {
      const updatedUser = new User(
        existingUser.id,
        dto.name,
        existingUser.email,
        hashedPassword,
        existingUser.isVerified,
        existingUser.provider,
        existingUser.googleId,
        existingUser.createdAt,
        existingUser.updatedAt,
      );
      savedUser = await this.userRepository.update(updatedUser);
    } else {
      const newUser = new User(null, dto.name, dto.email, hashedPassword, false);
      savedUser = await this.userRepository.create(newUser);
    }

    await this.generateEmailOtp(savedUser.email, 'VERIFY_EMAIL');

    return {
      message: 'Registration successful. Please verify your email.',
      email: savedUser.email,
      verificationRequired: true,
    };
  }

  async login(dto: LoginRequestDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('This account uses Google Sign-In. Please continue with Google.');
    }

    const isMatch = await this.passwordHasher.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in.');
    }

    return this.generateLoginResponse(user);
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<void> {
    const otp = await this.otpRepository.findValidOtp(dto.email, dto.otp, 'VERIFY_EMAIL');

    if (!otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.userRepository.verifyEmail(dto.email);
    await this.otpRepository.delete(dto.email);
  }

  async resendOtp(dto: ResendOtpDto): Promise<void> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.generateEmailOtp(dto.email, 'VERIFY_EMAIL');
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.generateEmailOtp(dto.email, 'RESET_PASSWORD');
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const otp = await this.otpRepository.findValidOtp(dto.email, dto.otp, 'RESET_PASSWORD');

    if (!otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.newPassword);

    await this.userRepository.updatePassword(dto.email, hashedPassword);
    await this.otpRepository.delete(dto.email);
  }

  async refreshToken(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    const hash = await this.tokenHasher.hash(refreshToken);
    const stored = await this.refreshTokenRepository.findByHash(hash);

    if (!stored) {
      throw new BadRequestException('Invalid refresh token.');
    }

    const user = await this.userRepository.findById(stored.userId);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    await this.refreshTokenRepository.delete(hash);

    const newRefreshToken = await this.generateRefreshToken(user.id!);
    const accessToken = await this.tokenProvider.generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id!, name: user.name, email: user.email },
    };
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    const hash = await this.tokenHasher.hash(refreshToken);
    await this.refreshTokenRepository.delete(hash);
  }

  async googleLogin(dto: GoogleLoginDto) {
    const googleUser = await this.googleAuthService.verifyIdToken(dto.idToken);

    let user = await this.userRepository.findByEmail(googleUser.email);

    if (!user) {
      user = await this.userRepository.create(
        new User(null, googleUser.name, googleUser.email, null, true, AuthProvider.GOOGLE, googleUser.googleId),
      );
    }

    return this.generateLoginResponse(user);
  }

  private async generateEmailOtp(email: string, purpose: 'VERIFY_EMAIL' | 'RESET_PASSWORD'): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpRepository.delete(email);

    await this.otpRepository.create(
      new Otp(null, email, otp, purpose, new Date(Date.now() + 1 * 60 * 1000), false),
    );

    if (purpose === 'VERIFY_EMAIL') {
      await this.emailService.sendVerificationOtp(email, otp);
    } else {
      await this.emailService.sendResetPasswordOtp(email, otp);
    }

    return otp;
  }

  private async generateLoginResponse(user: User) {
    const accessToken = await this.tokenProvider.generateAccessToken({
      sub: user.id!,
      email: user.email,
    });

    const refreshToken = await this.generateRefreshToken(user.id!);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id!, name: user.name, email: user.email },
    };
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    await this.refreshTokenRepository.deleteByUser(userId);

    const refreshToken = randomBytes(64).toString('hex');
    const tokenHash = await this.tokenHasher.hash(refreshToken);

    const expiresInDays = this.configService.getOrThrow<number>('REFRESH_TOKEN_EXPIRES_IN_DAYS');
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.create(new RefreshToken(null, userId, tokenHash, expiresAt));

    return refreshToken;
  }
}
