import { Inject, Injectable } from '@nestjs/common';

import type { IUrlRepository } from '../../../domain/repositories/url.repository';
import { URL_REPOSITORY } from '../../../domain/repositories/token';

import { UrlListResponseDto } from '../dto/url-list-response.dto';

@Injectable()
export class GetMyUrlsUseCase {
  constructor(
    @Inject(URL_REPOSITORY)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async execute(userId: string): Promise<UrlListResponseDto[]> {
    const urls = await this.urlRepository.findByUserId(userId);

    return urls.map((url) => ({
      id: url.id!,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `http://localhost:3000/api/${url.shortCode}`,
      clicks: url.clicks,
      createdAt: url.createdAt!,
    }));
  }
}