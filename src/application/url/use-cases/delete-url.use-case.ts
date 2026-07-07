import {
    Inject,
    Injectable,
    ForbiddenException,
    NotFoundException,
  } from '@nestjs/common';
  
  import type { IUrlRepository } from '../../../domain/repositories/url.repository';
  import { URL_REPOSITORY } from '../../../domain/repositories/token';
  
  @Injectable()
  export class DeleteUrlUseCase {
    constructor(
      @Inject(URL_REPOSITORY)
      private readonly urlRepository: IUrlRepository,
    ) {}
  
    async execute(id: string, userId: string): Promise<void> {
      const url = await this.urlRepository.findById(id);
  
      if (!url) {
        throw new NotFoundException('URL not found');
      }
  
      if (url.userId !== userId) {
        throw new ForbiddenException('You are not allowed to delete this URL');
      }
  
      await this.urlRepository.delete(id);
    }
  }