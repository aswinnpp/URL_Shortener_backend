import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { ITokenProvider } from '../../application/auth/interfaces/token-provider.interface';

@Injectable()
export class JwtTokenService implements ITokenProvider {
  constructor(private readonly jwtService: NestJwtService) {}

  async generateToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}