import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Length,
  Max,
} from 'class-validator';
import { VenueStatus } from '../enums/venue-status.enum';

export class CreateVenueDto {
  @Length(2, 64)
  name: string;

  @IsOptional()
  @Length(2, 512)
  description: string;

  @IsInt()
  @IsPositive()
  @Max(1_000)
  capacity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(1_000)
  fee: number;

  @IsOptional()
  @IsEnum(VenueStatus)
  status: VenueStatus;

  @IsUUID()
  activityId: string;
}
