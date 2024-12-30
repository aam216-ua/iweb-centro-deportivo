import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UsersService } from 'src/users/users.service';
import { VenuesService } from 'src/venues/venues.service';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly usersService: UsersService,
    private readonly venuesService: VenuesService,
  ) {}

  @Post()
  createAsReceptionist(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Post('/customer')
  createAsCustomer(@Body() createBookingDto: CreateBookingDto) {
    if (createBookingDto.appointeeId != createBookingDto.appointerId)
      throw new BadRequestException('appointer and appointee must match');

    // TODO: comprobar saldo y descontar precio de la pista

    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  findManyAsReceptionist() {
    return this.bookingsService.findMany();
  }

  @Get('/customer')
  findManyAsCustomer() {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
