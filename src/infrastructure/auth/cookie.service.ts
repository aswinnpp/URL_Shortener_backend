import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from './cookie.constants';

@Injectable()
export class CookieService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  setAccessToken(
    res: Response,
    token: string,
  ): void {
    res.cookie(
      ACCESS_TOKEN_COOKIE,
      token,
      {
        httpOnly: true,
        secure:
          this.configService.get<string>('NODE_ENV') ===
          'production',

        sameSite: 'lax',

        maxAge: Number(
          this.configService.getOrThrow(
            'ACCESS_TOKEN_COOKIE_MAX_AGE',
          ),
        ),
      },
    );
  }

  setRefreshToken(
    res: Response,
    token: string,
  ): void {
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      token,
      {
        httpOnly: true,
        secure:
          this.configService.get<string>('NODE_ENV') ===
          'production',

        sameSite: 'lax',

        maxAge: Number(
          this.configService.getOrThrow(
            'REFRESH_TOKEN_COOKIE_MAX_AGE',
          ),
        ),
      },
    );
  }

  clearAccessToken(
    res: Response,
  ): void {
    res.clearCookie(
      ACCESS_TOKEN_COOKIE,
    );
  }

  clearRefreshToken(
    res: Response,
  ): void {
    res.clearCookie(
      REFRESH_TOKEN_COOKIE,
    );
  }

  clearAuthCookies(
    res: Response,
  ): void {
    this.clearAccessToken(res);
    this.clearRefreshToken(res);
  }
}