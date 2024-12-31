import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(
  PickType(CreateBookingDto, ['date', 'turn', 'venueId'] as const)
) {}
