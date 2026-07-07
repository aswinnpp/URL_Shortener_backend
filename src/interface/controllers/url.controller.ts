import {
    Body,
    Controller,
    Post,
    UseGuards,
  } from '@nestjs/common';

  import { Get, Param, Res } from '@nestjs/common';
  import type { Response } from 'express';

  import { RedirectUrlUseCase } from '../../application/url/use-cases/redirect-url.use-case';
  
  import { JwtAuthGuard } from '../guards/jwt-auth.guard';
  import { CurrentUser } from '../decorators/current-user.decorator';
  
  import { CreateUrlDto } from '../../application/url/dto/create-url.dto';
  import { CreateShortUrlUseCase } from '../../application/url/use-cases/create-short-url.use-case';
  
  @Controller('url')
  export class UrlController {
    constructor(
        private readonly createShortUrlUseCase: CreateShortUrlUseCase,
        private readonly redirectUrlUseCase: RedirectUrlUseCase,
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
  }