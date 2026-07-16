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

import { UpdateUrlDto } from './dto/update-url.dto';
import { CreateUrlDto } from './dto/create-url.dto';
import { GetMyUrlsDto } from './dto/get-my-urls.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateUrlDto,
    @CurrentUser() user: any,
  ) {
    return this.urlService.create(dto, user.sub);
  }

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const originalUrl = await this.urlService.redirect(shortCode);

    return res.redirect(originalUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyUrls(
    @CurrentUser() user: any,
    @Query() query: GetMyUrlsDto,
  ) {
    return this.urlService.getMyUrls(user.sub, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics/:id')
  async analytics(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.urlService.getAnalytics(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    await this.urlService.delete(id, user.sub);

    return { message: 'URL deleted successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUrlDto,
    @CurrentUser() user: any,
  ) {
    await this.urlService.update(id, dto, user.sub);

    return { message: 'URL updated successfully.' };
  }
}
