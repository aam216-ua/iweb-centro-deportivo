import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { QueryVenueDto } from './dto/query-venue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { Activity } from './entities/activity.entity';
import { PaginatedResult } from 'src/common/type/paginated-result.type';

@Injectable()
export class VenuesService {
  private readonly logger = new Logger(VenuesService.name);
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>
  ) {}

  public async create(createVenueDto: CreateVenueDto): Promise<Venue> {
    if (await this.venueRepository.findOneBy({ name: createVenueDto.name })) {
      throw new ConflictException('venue name must be unique');
    }

    const activity = await this.activityRepository.findOneBy({
      id: createVenueDto.activityId,
    });

    if (!activity) throw new NotFoundException('activity does not exist');

    this.logger.debug('Creating and saving venue data');

    const venue = await this.venueRepository.save(
      this.venueRepository.create({
        ...createVenueDto,
        activity,
      })
    );

    return venue;
  }

  public async findMany(
    queryVenueDto: QueryVenueDto
  ): Promise<PaginatedResult<Venue>> {
    const {
      page = 0,
      size = 10,
      activityId = undefined,
      maxFee = undefined,
      minCapacity = undefined,
      status = undefined,
    } = queryVenueDto;

    const query = this.venueRepository
      .createQueryBuilder('venue')
      .leftJoinAndSelect('venue.activity', 'activity');

    if (activityId) {
      const activity = await this.activityRepository.findOneBy({
        id: activityId,
      });

      if (!activity) throw new NotFoundException('activity not found');

      query.andWhere({ activity: { id: activity.id } });
    }

    if (maxFee) query.andWhere('venue.fee <= :maxFee', { maxFee });
    // eslint-disable-next-line prettier/prettier
    if (minCapacity) query.andWhere('venue.capacity >= :minCapacity', { minCapacity });
    if (status) query.andWhere({ status });

    const [data, total] = await query
      .skip(page * size)
      .take(size)
      .getManyAndCount();

    return {
      data,
      meta: { page, size, total },
    } as PaginatedResult<Venue>;
  }

  public async findOne(id: string): Promise<Venue> {
    return await this.venueRepository.findOneBy({ id });
  }

  public async update(
    id: string,
    updateVenueDto: UpdateVenueDto
  ): Promise<UpdateResult> {
    if (this.findOne(id)) {
      return await this.venueRepository.update({ id }, updateVenueDto);
    } else {
      throw new NotFoundException('venue not found');
    }
  }

  public async remove(id: string): Promise<DeleteResult> {
    if (this.findOne(id)) {
      return await this.venueRepository.delete({ id });
    } else {
      throw new NotFoundException('venue not found');
    }
  }

  public async findActivities(): Promise<Activity[]> {
    return this.activityRepository.find();
  }
}
