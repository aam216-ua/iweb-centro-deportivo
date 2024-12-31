import { IsDate, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { Transform } from 'class-transformer';

export class QueryBookingDto extends PaginatedQueryDto {
  @IsOptional()
  @IsUUID()
  appointerId: string;

  @IsOptional()
  @IsUUID()
  appointeeId: string;

  @IsOptional()
  @IsUUID()
  venueId: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value as Date).setHours(0, 0, 0, 0))
  after: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value as Date).setHours(0, 0, 0, 0))
  before: Date;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sort: 'ASC' | 'DESC';
}
