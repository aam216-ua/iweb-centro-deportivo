import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginatedQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  size: number;
}
