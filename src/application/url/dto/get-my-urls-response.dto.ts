import { UrlListResponseDto } from './url-list-response.dto';

export class GetMyUrlsResponseDto {
  data: UrlListResponseDto[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}