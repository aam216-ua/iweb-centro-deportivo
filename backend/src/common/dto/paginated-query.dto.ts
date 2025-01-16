import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginatedQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Max(10_000)
  @Min(0)
  page: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Max(100)
  @Min(1)
  size: number;
}
