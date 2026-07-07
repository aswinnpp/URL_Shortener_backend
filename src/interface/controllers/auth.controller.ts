import { Body, Controller, Post } from '@nestjs/common';

import { RegisterRequestDto, RegisterResponseDto } from '../../application/auth/dto/register.dto';
import { LoginDto } from '../../application/auth/dto/login.dto';

import { RegisterUseCase } from '../../application/auth/use-cases/register.use-case';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}