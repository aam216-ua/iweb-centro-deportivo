import { IsEnum, IsUUID } from 'class-validator';
import { BookingTurn } from '../enums/booking-turn.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Día en el que ocurre la reserva',
    type: 'string',
    example: '2025-03-11',
  })
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setUTCHours(0, 0, 0, 0);
    if (date.getTime() < new Date().setUTCHours(0, 0, 0, 0))
      throw new BadRequestException('date must be today or greater');
    return date;
  })
  date: Date;

  @ApiProperty({
    description: 'Turno en el que ocurre la reserva',
    enum: [
      '08:00',
      '09:30',
      '11:00',
      '12:30',
      '14:00',
      '15:30',
      '17:00',
      '18:30',
      '20:00',
      '21:30',
    ],
    example: '09:30',
  })
  @IsEnum(BookingTurn)
  turn: BookingTurn;

  @ApiProperty({
    description: 'UUID del usuario que crea la reserva',
    type: 'string',
    example: '08a5c4ff-f1a8-4bbd-b48f-f1fa9b86ddfd',
  })
  @IsUUID()
  appointerId: string;

  @ApiProperty({
    description: 'UUID del usuario que atiende a la reserva',
    type: 'string',
    example: '08a5c4ff-f1a8-4bbd-b48f-f1fa9b86ddfd',
  })
  @IsUUID()
  appointeeId: string;

  @ApiProperty({
    description: 'UUID de la pista en la que ocurre la reserva',
    type: 'string',
    example: '08a5c4ff-f1a8-4bbd-b48f-f1fa9b86ddfd',
  })
  @IsUUID()
  venueId: string;
}
