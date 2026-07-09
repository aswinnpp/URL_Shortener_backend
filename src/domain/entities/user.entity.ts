export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

export class User {
  constructor(
    public readonly id: string | null,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string | null,
    public readonly isVerified: boolean,
    public readonly provider: AuthProvider = AuthProvider.LOCAL,
    public readonly googleId: string | null = null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
  }