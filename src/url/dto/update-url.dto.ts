import { IsString, IsNotEmpty, IsUrl, MinLength, MaxLength } from 'class-validator';

export class UpdateUrlDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsNotEmpty()
  @IsUrl()
  originalUrl!: string;
}
