import { IsString, IsNotEmpty, IsUrl, MinLength, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsUrl()
  originalUrl!: string;
}
