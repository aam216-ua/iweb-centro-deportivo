import { IsEnum, IsUUID } from 'class-validator';
import { BookingTurn } from '../enums/booking-turn.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class CreateBookingDto {
  @ApiProperty()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setUTCHours(0, 0, 0, 0);
    if (date.getTime() < new Date().setUTCHours(0, 0, 0, 0))
      throw new BadRequestException('date must be today or greater');
    return date;
  })
  date: Date;

  @IsEnum(BookingTurn)
  turn: BookingTurn;

  @IsUUID()
  appointerId: string;

  @IsUUID()
  appointeeId: string;

  @IsUUID()
  venueId: string;
}
