import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { IUrlRepository } from '../interfaces/url-repository.interface';
import { URL_REPOSITORY } from '../constants/injection-tokens';

@Injectable()
export class RedirectUrlService {
  constructor(
    @Inject(URL_REPOSITORY)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async redirect(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    await this.urlRepository.incrementClicks(shortCode);

    return url.originalUrl;
  }
}
