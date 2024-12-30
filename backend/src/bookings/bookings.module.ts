import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { UsersModule } from 'src/users/users.module';
import { VenuesModule } from 'src/venues/venues.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), UsersModule, VenuesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
