import { Inject, Injectable } from '@nestjs/common';

import { URL_REPOSITORY } from '../constants/injection-tokens';
import type { IUrlRepository } from '../interfaces/url-repository.interface';

import { GetMyUrlsDto } from '../dto/get-my-urls.dto';
import { GetMyUrlsResponseDto } from '../dto/get-my-urls-response.dto';

@Injectable()
export class GetMyUrlsService {
  constructor(
    @Inject(URL_REPOSITORY)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async getMyUrls(
    userId: string,
    query: GetMyUrlsDto,
  ): Promise<GetMyUrlsResponseDto> {
    const {
      page,
      limit,
      search,
      sortBy,
      order,
    } = query;

    const { urls, total } =
      await this.urlRepository.findByUser(
        userId,
        page,
        limit,
        search,
        sortBy,
        order,
      );

    return {
      data: urls.map((url) => ({
        id: url.id!,
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
}
