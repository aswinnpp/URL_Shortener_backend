export class RefreshToken {
  constructor(
    public id: string | null,
    public userId: string,
    public tokenHash: string,
    public expiresAt: Date,
    public createdAt?: Date,
  ) {}
}
