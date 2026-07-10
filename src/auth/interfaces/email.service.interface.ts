export interface IEmailService {
  sendVerificationOtp(
    email: string,
    otp: string,
  ): Promise<void>;

  sendResetPasswordOtp(
    email: string,
    otp: string,
  ): Promise<void>;
}

export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');
