import { Inject, Injectable } from '@nestjs/common';

import { Url } from '../../../domain/entities/url.entity';
import type { IUrlRepository } from '../../../domain/repositories/url.repository';
import { URL_REPOSITORY } from '../../../domain/repositories/token';

import { CreateUrlDto } from '../dto/create-url.dto';
import { UrlResponseDto } from '../dto/url-response.dto';

@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    @Inject(URL_REPOSITORY)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async execute(
    dto: CreateUrlDto,
    userId: string,
  ): Promise<UrlResponseDto> {
    const shortCode = this.generateShortCode();

    const url = new Url(
      null,
      dto.originalUrl,
      shortCode,
      userId,
      0,
      new Date(),
    );

    const savedUrl = await this.urlRepository.create(url);

    return {
      id: savedUrl.id!,
      originalUrl: savedUrl.originalUrl,
      shortCode: savedUrl.shortCode,
      clicks: savedUrl.clicks,
      shortUrl: `http://localhost:3000/api/url/${savedUrl.shortCode}`,
    };
  }

  private generateShortCode(length = 6): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let code = '';

    for (let i = 0; i < length; i++) {
      code += chars.charAt(
        Math.floor(Math.random() * chars.length),
      );
    }

    return code;
  }
}