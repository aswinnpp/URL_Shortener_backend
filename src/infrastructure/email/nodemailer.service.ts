import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { IEmailService } from '../../application/auth/interfaces/email.service.interface';

@Injectable()
export class NodemailerService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<string>('SMTP_PORT')),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationOtp(
    email: string,
    otp: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to: email,
      subject: 'Verify your email',
      text: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
    });
  }

  async sendResetPasswordOtp(
    email: string,
    otp: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to: email,
      subject: 'Reset Password',
      text: `Your password reset OTP is ${otp}. It expires in 5 minutes.`,
    });
  }
}