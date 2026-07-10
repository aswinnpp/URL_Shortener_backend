import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';

import type { Response } from 'express';

import { GetMyUrlsService } from './services/get-my-urls.service';
import { UpdateUrlDto } from './dto/update-url.dto';
import { RedirectUrlService } from './services/redirect-url.service';
import { UpdateUrlService } from './services/update-url.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GetUrlAnalyticsService } from './services/get-url-analytics.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { CreateShortUrlService } from './services/create-short-url.service';
import { DeleteUrlService } from './services/delete-url.service';
import { GetMyUrlsDto } from './dto/get-my-urls.dto';

@Controller('url')
export class UrlController {
  constructor(
    private readonly createShortUrlService: CreateShortUrlService,
    private readonly redirectUrlService: RedirectUrlService,
    private readonly getMyUrlsService: GetMyUrlsService,
    private readonly getUrlAnalyticsService: GetUrlAnalyticsService,
    private readonly deleteUrlService: DeleteUrlService,
    private readonly updateUrlService: UpdateUrlService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateUrlDto,
    @CurrentUser() user: any,
  ) {
    return this.createShortUrlService.create(
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
      await this.redirectUrlService.redirect(shortCode);

    return res.redirect(originalUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyUrls(
    @CurrentUser() user: any,
    @Query() query: GetMyUrlsDto,
  ) {
    return this.getMyUrlsService.getMyUrls(
      user.sub,
      query,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics/:id')
  async analytics(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.getUrlAnalyticsService.getAnalytics(
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
    await this.deleteUrlService.delete(
      id,
      user.sub,
    );

    return {
      message: 'URL deleted successfully.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUrlDto,
    @CurrentUser() user: any,
  ) {
    await this.updateUrlService.update(
      id,
      dto,
      user.sub,
    );

    return {
      message: 'URL updated successfully.',
    };
  }
}
