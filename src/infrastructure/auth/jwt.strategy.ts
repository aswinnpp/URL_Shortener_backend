import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

import { ACCESS_TOKEN_COOKIE } from './cookie.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.[ACCESS_TOKEN_COOKIE] ?? null;
        },
      ]),

      ignoreExpiration: false,

      secretOrKey: configService.getOrThrow<string>(
        'JWT_SECRET',
      ),
    });
  }

  async validate(payload: any) {
    return payload;
  }
}