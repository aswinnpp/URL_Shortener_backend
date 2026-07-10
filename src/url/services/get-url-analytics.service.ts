import {
    Inject,
    Injectable,
    ForbiddenException,
    NotFoundException,
  } from '@nestjs/common';

  import type { IUrlRepository } from '../interfaces/url-repository.interface';
  import { URL_REPOSITORY } from '../constants/injection-tokens';

  import { UrlAnalyticsResponseDto } from '../dto/analytics-response.dto';

  @Injectable()
  export class GetUrlAnalyticsService {
    constructor(
      @Inject(URL_REPOSITORY)
      private readonly urlRepository: IUrlRepository,
    ) {}

    async getAnalytics(
      id: string,
      userId: string,
    ): Promise<UrlAnalyticsResponseDto> {
      const url = await this.urlRepository.findById(id);

      if (!url) {
        throw new NotFoundException('URL not found');
      }

      if (url.userId !== userId) {
        throw new ForbiddenException(
          'You are not allowed to view this URL analytics',
        );
      }

      return {
        id: url.id!,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `http://localhost:3000/api/url/${url.shortCode}`,
        totalClicks: url.clicks,
        createdAt: url.createdAt!,
      };
    }
  }
