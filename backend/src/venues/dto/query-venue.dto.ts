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

export class QueryVenueDto extends PaginatedQueryDto {
  @IsOptional()
  @IsUUID()
  activityId: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(1_000)
  maxFee: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(1_000)
  minCapacity: number;

  @IsOptional()
  @IsEnum(VenueStatus)
  status: VenueStatus;
}
