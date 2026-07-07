import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { IUrlRepository } from '../../../domain/repositories/url.repository';
import { URL_REPOSITORY } from '../../../domain/repositories/token';

@Injectable()
export class RedirectUrlUseCase {
  constructor(
    @Inject(URL_REPOSITORY)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async execute(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    await this.urlRepository.incrementClicks(shortCode);

    return url.originalUrl;
  }
}