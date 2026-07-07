import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../infrastructure/database/database.module';
import { AuthInfrastructureModule } from '../../infrastructure/auth/auth.module';

import { RegisterUseCase } from './use-cases/register.use-case';
import { LoginUseCase } from './use-cases/login.use-case';

import { AuthController } from '../../interface/controllers/auth.controller';

@Module({
  imports: [
    DatabaseModule,
    AuthInfrastructureModule,
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    RegisterUseCase,
    LoginUseCase,
  ],

  exports: [
    RegisterUseCase,
    LoginUseCase,
  ],
})
export class AuthModule {}