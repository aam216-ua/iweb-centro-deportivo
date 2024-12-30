import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UsersService } from 'src/users/users.service';
import { VenuesService } from 'src/venues/venues.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Session } from 'src/auth/decorators/session.decorator';
import { UserSession } from 'src/auth/types/user-session.type';
import { UserRole } from 'src/users/enums/user-role.enum';
import { QueryBookingDto } from './dto/query-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly usersService: UsersService,
    private readonly venuesService: VenuesService
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Session() session: UserSession,
    @Body() createBookingDto: CreateBookingDto
  ) {
    if (session.role == UserRole.CUSTOMER) {
      if (
        createBookingDto.appointeeId != session.id ||
        createBookingDto.appointerId != session.id
      )
        throw new UnauthorizedException('insufficient permissions');
    }

    return this.bookingsService.create(createBookingDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findMany(
    @Session() session: UserSession,
    @Body() queryBookingDto: QueryBookingDto
  ) {
    if (session.role == UserRole.CUSTOMER)
      queryBookingDto.appointeeId = session.id;

    return this.bookingsService.findMany(queryBookingDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Session() session: UserSession, @Param('id') id: string) {
    if (session.role == UserRole.CUSTOMER)
      throw new UnauthorizedException('insufficient permissions');

    return this.bookingsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto
  ) {
    if (session.role == UserRole.CUSTOMER)
      throw new UnauthorizedException('insufficient permissions');

    return this.bookingsService.update(id, updateBookingDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Session() session: UserSession, @Param('id') id: string) {
    if (session.role == UserRole.CUSTOMER)
      throw new UnauthorizedException('insufficient permissions');

    return this.bookingsService.remove(id);
  }
}
