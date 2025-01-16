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
  Query,
  HttpStatus,
  NotFoundException,
  Logger,
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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Booking } from './entities/booking.entity';
import { PaginatedResult } from 'src/common/type/paginated-result.type';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('bookings')
export class BookingsController {
  private readonly logger = new Logger(BookingsController.name);

  constructor(
    private readonly bookingsService: BookingsService,
    private readonly usersService: UsersService,
    private readonly venuesService: VenuesService
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear una reserva' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Booking })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  async create(
    @Session() session: UserSession,
    @Body() createBookingDto: CreateBookingDto
  ): Promise<Booking> {
    if (session.role == UserRole.CUSTOMER) {
      if (
        createBookingDto.appointeeId != session.id ||
        createBookingDto.appointerId != session.id
      )
        throw new UnauthorizedException('insufficient permissions');

      const venue = await this.venuesService.findOne(createBookingDto.venueId);

      if (!venue) throw new NotFoundException('venue not found');

      this.usersService.modifyBalance(session.id, -venue.fee);
    }

    return this.bookingsService.create(createBookingDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Buscar reservas' })
  @ApiResponse({ status: HttpStatus.OK, type: [Booking] })
  findMany(
    @Session() session: UserSession,
    @Query() queryBookingDto: QueryBookingDto
  ): Promise<PaginatedResult<Booking>> {
    if (session.role == UserRole.CUSTOMER)
      queryBookingDto.appointeeId = session.id;

    return this.bookingsService.findMany(queryBookingDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar una reserva por id' })
  @ApiResponse({ status: HttpStatus.OK, type: Booking })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  findOne(
    @Session() session: UserSession,
    @Param('id') id: string
  ): Promise<Booking> {
    if (session.role == UserRole.CUSTOMER)
      throw new UnauthorizedException('insufficient permissions');

    return this.bookingsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una reserva' })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateResult })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  update(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto
  ): Promise<UpdateResult> {
    if (session.role == UserRole.CUSTOMER)
      throw new UnauthorizedException('insufficient permissions');

    return this.bookingsService.update(id, updateBookingDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una reserva' })
  @ApiResponse({ status: HttpStatus.OK, type: DeleteResult })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  async remove(
    @Session() session: UserSession,
    @Param('id') id: string
  ): Promise<DeleteResult> {
    const booking = await this.bookingsService.findOne(id);

    if (!booking) throw new NotFoundException('booking not found');

    this.logger.debug(`Called with user session ${session.id}`);

    if (session.role == UserRole.CUSTOMER && booking.appointee.id != session.id)
      throw new UnauthorizedException('insufficient permissions');

    // devolver el dinero para reservas futuras
    if (booking.date > new Date())
      await this.usersService.modifyBalance(booking.appointee.id, booking.fee);

    return await this.bookingsService.remove(id);
  }
}
