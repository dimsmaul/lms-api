import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  search?: string;
}
