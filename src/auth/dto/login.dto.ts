import { IsEmail, MinLength } from 'class-validator';
export class LoginRequestDto {
  @IsEmail() email: string;
  @MinLength(6) password: string;
}
export class LoginResponseDto {
  user: { id: string; name: string; email: string; };
}
