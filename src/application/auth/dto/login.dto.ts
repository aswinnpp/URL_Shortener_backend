import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  accessToken: string;

  refreshToken: string;

  user: {
    id: string;
    name: string;
    email: string;
  };
}