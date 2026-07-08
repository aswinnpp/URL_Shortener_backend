import { Inject, Injectable } from '@nestjs/common';


import { URL_REPOSITORY } from '../../../domain/repositories/token';
import type { IUrlRepository } from '../../../domain/repositories/url.repository';

import { GetMyUrlsDto } from '../dto/get-my-urls.dto';
import { GetMyUrlsResponseDto } from '../dto/get-my-urls-response.dto';
import { UrlListResponseDto } from '../dto/url-list-response.dto';

@Injectable()
export class GetMyUrlsUseCase {
  constructor(
    @Inject(URL_REPOSITORY)
    private readonly urlRepository: IUrlRepository,
  ) {}

  async execute(
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