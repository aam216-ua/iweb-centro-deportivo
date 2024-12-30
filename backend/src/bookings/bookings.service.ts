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
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { VenuesService } from 'src/venues/venues.service';

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
        venue,
      })
    ) {
      throw new ConflictException('this spot is already taken');
    }

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

  public async findMany() {}

  public async findOne(id: string) {}

  public async update(id: string, updateBookingDto: UpdateBookingDto) {}

  public async remove(id: string) {}
}
