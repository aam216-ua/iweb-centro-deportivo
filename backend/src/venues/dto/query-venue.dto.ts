import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Max,
} from 'class-validator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { VenueStatus } from '../enums/venue-status.enum';
import { Transform } from 'class-transformer';

export class QueryVenueDto extends PaginatedQueryDto {
  @IsOptional()
  @IsUUID()
  activityId: string;

  @IsOptional()
  @Transform(({ value }) => Number.parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(1_000)
  maxFee: number;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  @IsPositive()
  @Max(20)
  minCapacity: number;

  @IsOptional()
  @IsEnum(VenueStatus)
  status: VenueStatus;
}
