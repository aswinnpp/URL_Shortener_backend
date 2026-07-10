export class Otp {
  constructor(
    public id: string | null,
    public email: string,
    public code: string,
    public purpose: 'VERIFY_EMAIL' | 'RESET_PASSWORD',
    public expiresAt: Date,
    public verified: boolean,
    public createdAt?: Date,
  ) {}
}
