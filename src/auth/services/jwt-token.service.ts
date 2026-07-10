import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import type { ITokenProvider } from '../interfaces/token-provider.interface';

@Injectable()
export class JwtTokenService implements ITokenProvider {
  constructor(
    private readonly jwtService: NestJwtService,
  ) {}

  async generateAccessToken(
    payload: object,
  ): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyAccessToken(
    token: string,
  ): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
