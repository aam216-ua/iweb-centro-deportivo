import { IsInt, Min } from 'class-validator';

export class PaginatedQueryDto {
  @IsInt()
  @Min(0)
  page: number;

  @IsInt()
  @Min(1)
  size: number;
}
