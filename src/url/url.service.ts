import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Url } from './schemas/url.schema';
import type { IUrlRepository } from './interfaces/url-repository.interface';
import { URL_REPOSITORY } from './constants/injection-tokens';

import type { CreateUrlDto } from './dto/create-url.dto';
import type { UrlResponseDto } from './dto/url-response.dto';
import type { GetMyUrlsDto } from './dto/get-my-urls.dto';
import type { GetMyUrlsResponseDto } from './dto/get-my-urls-response.dto';
import type { UrlAnalyticsResponseDto } from './dto/analytics-response.dto';
import type { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlService {
  constructor(
    @Inject(URL_REPOSITORY)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async create(dto: CreateUrlDto, userId: string): Promise<UrlResponseDto> {
    const shortCode = this.generateShortCode();

    const url = new Url(null, dto.name, dto.originalUrl, shortCode, userId, 0, new Date());
    const savedUrl = await this.urlRepository.create(url);

    return {
      id: savedUrl.id!,
      name: savedUrl.name,
      originalUrl: savedUrl.originalUrl,
      shortCode: savedUrl.shortCode,
      clicks: savedUrl.clicks,
      shortUrl: `${process.env.APP_URL}/api/url/${savedUrl.shortCode}`,
    };
  }

  async redirect(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    await this.urlRepository.incrementClicks(shortCode);

    return url.originalUrl;
  }

  async getMyUrls(userId: string, query: GetMyUrlsDto): Promise<GetMyUrlsResponseDto> {
    const { page, limit, search, sortBy, order } = query;

    const { urls, total } = await this.urlRepository.findByUser(userId, page, limit, search, sortBy, order);

    return {
      data: urls.map((url) => ({
        id: url.id!,
        name: url.name,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${process.env.APP_URL}/api/url/${url.shortCode}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }

  async getAnalytics(id: string, userId: string): Promise<UrlAnalyticsResponseDto> {
    const url = await this.urlRepository.findById(id);

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('You are not allowed to view this URL analytics');
    }

    return {
      id: url.id!,
      name: url.name,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `http://localhost:3000/api/url/${url.shortCode}`,
      totalClicks: url.clicks,
      createdAt: url.createdAt!,
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    const url = await this.urlRepository.findById(id);

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this URL');
    }

    await this.urlRepository.delete(id);
  }

  async update(id: string, dto: UpdateUrlDto, userId: string): Promise<void> {
    const url = await this.urlRepository.findById(id);

    if (!url) {
      throw new NotFoundException('URL not found.');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this URL.');
    }

    if (url.originalUrl === dto.originalUrl && url.name === dto.name) {
      throw new BadRequestException('No changes detected.');
    }

    const updatedUrl = new Url(url.id, dto.name, dto.originalUrl, url.shortCode, url.userId, url.clicks, url.createdAt, url.updatedAt);

    await this.urlRepository.update(updatedUrl);
  }

  private generateShortCode(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
