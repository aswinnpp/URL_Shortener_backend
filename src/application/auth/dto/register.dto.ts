import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

export class RegisterResponseDto {
  message: string;
  email: string;
  verificationRequired: boolean;
}