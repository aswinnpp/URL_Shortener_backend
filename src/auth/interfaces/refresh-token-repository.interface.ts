import { RefreshToken } from '../entities/refresh-token.entity';

export interface IRefreshTokenRepository {
  create(token: RefreshToken): Promise<RefreshToken>;
  findByHash(tokenHash: string): Promise<RefreshToken | null>;
  delete(tokenHash: string): Promise<void>;
  deleteByUser(userId: string): Promise<void>;
}
