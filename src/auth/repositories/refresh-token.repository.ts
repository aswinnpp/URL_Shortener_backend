import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { RefreshToken } from '../../entities/refresh-token.entity';
import type { IRefreshTokenRepository } from '../interfaces/refresh-token-repository.interface';

import {
  RefreshTokenDocument,
  RefreshTokenSchema,
} from '../schemas/refresh-token.schema';

@Injectable()
export class RefreshTokenRepository
  implements IRefreshTokenRepository
{
  constructor(
    @InjectModel(
      RefreshTokenSchema.name,
    )
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async create(
    token: RefreshToken,
  ): Promise<RefreshToken> {
    const created =
      await this.refreshTokenModel.create({
        userId: token.userId,
        tokenHash: token.tokenHash,
        expiresAt: token.expiresAt,
      });

    return this.toDomain(created);
  }

  async findByHash(
    tokenHash: string,
  ): Promise<RefreshToken | null> {
    const token =
      await this.refreshTokenModel.findOne({
        tokenHash,
      });

    if (!token) {
      return null;
    }

    return this.toDomain(token);
  }

  async delete(
    tokenHash: string,
  ): Promise<void> {
    await this.refreshTokenModel.deleteOne({
      tokenHash,
    });
  }

  async deleteByUser(
    userId: string,
  ): Promise<void> {
    await this.refreshTokenModel.deleteMany({
      userId,
    });
  }

  private toDomain(
    doc: RefreshTokenDocument,
  ): RefreshToken {
    return new RefreshToken(
      doc._id.toString(),
      doc.userId,
      doc.tokenHash,
      doc.expiresAt,
      doc.createdAt,
    );
  }
}
