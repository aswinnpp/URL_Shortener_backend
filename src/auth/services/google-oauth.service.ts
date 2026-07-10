import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

import {
  GoogleUserPayload,
  IGoogleAuthService,
} from '../interfaces/google-auth.interface';

@Injectable()
export class GoogleOAuthService implements IGoogleAuthService {
  private readonly client: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.client = new OAuth2Client(
      this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async verifyIdToken(
    idToken: string,
  ): Promise<GoogleUserPayload> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.configService.getOrThrow<string>(
        'GOOGLE_CLIENT_ID',
      ),
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException(
        'Invalid Google token',
      );
    }

    return {
      googleId: payload.sub,
      email: payload.email!,
      name: payload.name!,
      picture: payload.picture,
    };
  }
}
