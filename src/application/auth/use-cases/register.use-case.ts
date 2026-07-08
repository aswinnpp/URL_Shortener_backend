import {
  Inject,
  Injectable,
  ConflictException,
} from '@nestjs/common';

import { User } from '../../../domain/entities/user.entity';

import type { IUserRepository } from '../../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../domain/repositories/token';

import { GenerateEmailOtpUseCase } from './generate-email-otp.use-case';

import {
  RegisterRequestDto,
  RegisterResponseDto,
} from '../dto/register.dto';

import type { IPasswordHasher } from '../interfaces/password-hasher.interface';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject('PASSWORD_HASHER')
    private readonly passwordHasher: IPasswordHasher,

    private readonly generateEmailOtpUseCase: GenerateEmailOtpUseCase,
  ) {}

  async execute(
    dto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const existingUser =
      await this.userRepository.findByEmail(dto.email);

    if (existingUser?.isVerified) {
      throw new ConflictException(
        'Email already exists.',
      );
    }

    const hashedPassword =
      await this.passwordHasher.hash(dto.password);

    let savedUser: User;

    if (existingUser) {
      const updatedUser = new User(
        existingUser.id,
        dto.name,
        existingUser.email,
        hashedPassword,
        existingUser.isVerified,
        existingUser.createdAt,
        existingUser.updatedAt,
      );

      savedUser =
        await this.userRepository.update(updatedUser);
    } else {
      const newUser = new User(
        null,
        dto.name,
        dto.email,
        hashedPassword,
        false,
      );

      savedUser =
        await this.userRepository.create(newUser);
    }

    await this.generateEmailOtpUseCase.execute(
      savedUser.email,
      'VERIFY_EMAIL',
    );

    return {
      message:
        'Registration successful. Please verify your email.',
      email: savedUser.email,
      verificationRequired: true,
    };
  }
}