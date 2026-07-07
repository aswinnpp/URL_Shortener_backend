import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

import type { ITokenHasher } from '../../application/auth/interfaces/token-hasher.interface';

@Injectable()
export class TokenHasherService
  implements ITokenHasher
{
  async hash(
    token: string,
  ): Promise<string> {
    return createHash('sha256')
      .update(token)
      .digest('hex');
  }

  async compare(
    token: string,
    hash: string,
  ): Promise<boolean> {
    const hashed =
      await this.hash(token);

    return hashed === hash;
  }
}