import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { Url } from '../../../domain/entities/url.entity';
  
  import type { IUrlRepository } from '../../../domain/repositories/url.repository';
  
  import { URL_REPOSITORY } from '../../../domain/repositories/token';
  
  import { UpdateUrlDto } from '../dto/update-url.dto';
  
  @Injectable()
  export class UpdateUrlUseCase {
    constructor(
      @Inject(URL_REPOSITORY)
      private readonly urlRepository: IUrlRepository,
    ) {}
  
    async execute(
      id: string,
      dto: UpdateUrlDto,
      userId: string,
    ): Promise<void> {
      const url = await this.urlRepository.findById(id);
  
      if (!url) {
        throw new NotFoundException(
          'URL not found.',
        );
      }
  
      if (url.userId !== userId) {
        throw new ForbiddenException(
          'You are not allowed to update this URL.',
        );
      }
  
      if (url.originalUrl === dto.originalUrl) {
        throw new BadRequestException(
          'No changes detected.',
        );
      }
  
      const updatedUrl = new Url(
        url.id,
        dto.originalUrl,
        url.shortCode,
        url.userId,
        url.clicks,
        url.createdAt,
        url.updatedAt,
      );
  
      await this.urlRepository.update(updatedUrl);
    }
  }