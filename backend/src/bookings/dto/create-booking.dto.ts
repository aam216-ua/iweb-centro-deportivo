import { IsEnum, IsUUID, MinDate } from 'class-validator';
import { BookingTurn } from '../enums/booking-turn.entity';

export class CreateBookingDto {
  @MinDate(new Date(new Date().setHours(0, 0, 0, 0)))
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
