import type { Response } from 'express';

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from './cookie.constants';

export class CookieHelper {
  static setAccessToken(
    res: Response,
    token: string,
    maxAge: number,
  ) {
    res.cookie(
      ACCESS_TOKEN_COOKIE,
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          'production',
        sameSite: 'lax',
        maxAge,
      },
    );
  }

  static setRefreshToken(
    res: Response,
    token: string,
    maxAge: number,
  ) {
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          'production',
        sameSite: 'lax',
        maxAge,
      },
    );
  }

  static clearAccessToken(
    res: Response,
  ) {
    res.clearCookie(
      ACCESS_TOKEN_COOKIE,
    );
  }

  static clearRefreshToken(
    res: Response,
  ) {
    res.clearCookie(
      REFRESH_TOKEN_COOKIE,
    );
  }
}