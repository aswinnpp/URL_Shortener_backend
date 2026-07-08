import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';

import { GetMyUrlsUseCase } from '../../application/url/use-cases/get-my-urls.use-case';

import { RedirectUrlUseCase } from '../../application/url/use-cases/redirect-url.use-case';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GetUrlAnalyticsUseCase } from '../../application/url/use-cases/get-url-analytics.use-case';
import { CreateUrlDto } from '../../application/url/dto/create-url.dto';
import { CreateShortUrlUseCase } from '../../application/url/use-cases/create-short-url.use-case';
import { Delete } from '@nestjs/common';
import { DeleteUrlUseCase } from '../../application/url/use-cases/delete-url.use-case';

@Controller('url')
export class UrlController {
  constructor(
    private readonly createShortUrlUseCase: CreateShortUrlUseCase,
    private readonly redirectUrlUseCase: RedirectUrlUseCase,
    private readonly getMyUrlsUseCase: GetMyUrlsUseCase,
    private readonly getUrlAnalyticsUseCase: GetUrlAnalyticsUseCase,
    private readonly deleteUrlUseCase: DeleteUrlUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateUrlDto,
    @CurrentUser() user: any,
  ) {
    return this.createShortUrlUseCase.execute(
      dto,
      user.sub,
    );
  }
  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const originalUrl =
      await this.redirectUrlUseCase.execute(shortCode);

    return res.redirect(originalUrl);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyUrls(
    @CurrentUser() user: any,
  ) {
    return this.getMyUrlsUseCase.execute(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics/:id')
  async analytics(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.getUrlAnalyticsUseCase.execute(
      id,
      user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
@Delete(':id')
async delete(
  @Param('id') id: string,
  @CurrentUser() user: any,
) {
  await this.deleteUrlUseCase.execute(
    id,
    user.sub,
  );

  return {
    message: 'URL deleted successfully.',
  };
}
}