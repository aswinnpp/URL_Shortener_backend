import { Otp } from '../entities/otp.entity';

export interface IOtpRepository {
  create(otp: Otp): Promise<Otp>;

  findValidOtp(
    email: string,
    code: string,
    purpose: 'VERIFY_EMAIL' | 'RESET_PASSWORD',
  ): Promise<Otp | null>;

  delete(email: string): Promise<void>;
}