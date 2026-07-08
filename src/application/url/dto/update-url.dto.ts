import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateUrlDto {
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}