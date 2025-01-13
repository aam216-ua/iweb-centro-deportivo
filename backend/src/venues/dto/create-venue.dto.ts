import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { VenueStatus } from '../enums/venue-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVenueDto {
  @ApiProperty({
    description: 'Nombre',
    type: 'string',
    example: 'Gran Pista',
    minLength: 2,
    maxLength: 64,
  })
  @Length(2, 64)
  name: string;

  @ApiProperty({
    description: 'Descripción',
    type: 'string',
    example: 'La pista más grande de todas',
    minLength: 2,
    maxLength: 512,
  })
  @ApiProperty()
  @IsOptional()
  @Length(2, 512)
  description: string;

  @ApiProperty({
    description: 'Aforo',
    type: 'integer',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @IsPositive()
  @Max(100)
  capacity: number;

  @ApiProperty({
    description: 'Tarifa por reserva',
    type: 'number',
    example: 10.99,
    minimum: 0,
    maximum: 9_999.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9_999.99)
  fee: number;

  @ApiProperty({
    description: 'Estado actual',
    enum: ['available', 'unavailable'],
    example: 'available',
    required: false,
  })
  @IsOptional()
  @IsEnum(VenueStatus)
  status: VenueStatus;

  @ApiProperty({
    description: 'Deporte realizado',
    type: 'string',
    example: '08a5c4ff-f1a8-4bbd-b48f-f1fa9b86ddfd',
  })
  @IsUUID()
  activityId: string;
}
