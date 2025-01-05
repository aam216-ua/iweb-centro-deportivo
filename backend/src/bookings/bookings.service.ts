import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { VenuesService } from 'src/venues/venues.service';
import { QueryBookingDto } from './dto/query-booking.dto';
import { PaginatedResult } from 'src/common/type/paginated-result.type';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly userService: UsersService,
    private readonly venueService: VenuesService
  ) {}

  public async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const appointer = await this.userService.findOne(
        createBookingDto.appointerId
      ),
      appointee = await this.userService.findOne(createBookingDto.appointeeId),
      venue = await this.venueService.findOne(createBookingDto.venueId);

    if (!appointer) throw new NotFoundException('appointer user not found');
    if (!appointee) throw new NotFoundException('appointee user not found');
    if (!venue) throw new NotFoundException('venue not found');

    if (
      await this.bookingRepository.findOneBy({
        date: createBookingDto.date,
        turn: createBookingDto.turn,
        fee: venue.fee,
        venue,
      })
    ) {
      throw new ConflictException('this spot is already taken');
    }

    this.logger.debug('Creating and saving booking data');

    const booking = await this.bookingRepository.save(
      this.bookingRepository.create({
        ...createBookingDto,
        appointer,
        appointee,
        venue,
      })
    );

    return booking;
  }

  public async findMany(
    queryBookingDto: QueryBookingDto
  ): Promise<PaginatedResult<Booking>> {
    const {
      page = 0,
      size = 10,
      appointeeId = undefined,
      appointerId = undefined,
      venueId = undefined,
      after = undefined,
      before = undefined,
      sort = 'DESC',
    } = queryBookingDto;

    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.venue', 'venue')
      .leftJoinAndSelect('booking.appointer', 'user.booked')
      .leftJoinAndSelect('booking.appointee', 'user.bookings')
      .orderBy('booking.date', sort);

    if (appointeeId)
      query.andWhere({
        appointee: await this.userService.findOne(appointeeId),
      });

    if (appointerId)
      query.andWhere({
        appointer: await this.userService.findOne(appointerId),
      });

    if (venueId)
      query.andWhere({ venue: await this.venueService.findOne(venueId) });

    if (after) query.andWhere('booking.date >= :after', after);

    if (before) query.andWhere('booking.date <= :before', before);

    const [data, total] = await query
      .skip(page * size)
      .take(size)
      .getManyAndCount();

    return {
      data,
      meta: { page, size, total },
    } as PaginatedResult<Booking>;
  }

  public async findOne(id: string) {
    return await this.bookingRepository.findOneBy({ id });
  }

  public async update(
    id: string,
    updateBookingDto: UpdateBookingDto
  ): Promise<UpdateResult> {
    if (!this.findOne(id)) throw new NotFoundException('booking not found');

    if (!updateBookingDto.venueId)
      return await this.bookingRepository.update({ id }, updateBookingDto);

    const venue = await this.venueService.findOne(updateBookingDto.venueId);

    if (!venue) throw new NotFoundException('venue not found');

    delete updateBookingDto.venueId;

    return await this.bookingRepository.update(
      { id },
      {
        ...updateBookingDto,
        venue,
      }
    );
  }

  public async remove(id: string): Promise<DeleteResult> {
    if (!this.findOne(id)) throw new NotFoundException('booking not found');

    return await this.bookingRepository.delete({ id });
  }
}
