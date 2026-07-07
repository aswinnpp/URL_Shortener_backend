import { Inject, Injectable, ConflictException } from '@nestjs/common';

import { User } from '../../../domain/entities/user.entity';
import type { IUserRepository } from '../../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../domain/repositories/token';

import { RegisterRequestDto, RegisterResponseDto } from '../dto/register.dto';
import type { IPasswordHasher } from '../interfaces/password-hasher.interface';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject('PASSWORD_HASHER')
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const user = new User(
      null,
      dto.name,
      dto.email,
      hashedPassword,
    );
    const savedUser = await this.userRepository.create(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
    };  }
}