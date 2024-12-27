import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginatedQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  @Min(0)
  page: number;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  @Min(1)
  size: number;
}
