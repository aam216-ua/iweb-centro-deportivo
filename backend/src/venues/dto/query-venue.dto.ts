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
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(9_999.99)
  maxFee: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  @Max(100)
  minCapacity: number;

  @IsOptional()
  @IsEnum(VenueStatus)
  status: VenueStatus;
}
