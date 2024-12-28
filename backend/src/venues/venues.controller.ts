import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { QueryVenueDto } from './dto/query-venue.dto';

@Controller()
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Post('venues/')
  create(@Body() createVenueDto: CreateVenueDto) {
    return this.venuesService.create(createVenueDto);
  }

  @Get('venues/')
  findMany(@Query() queryVenueDto: QueryVenueDto) {
    return this.venuesService.findMany(queryVenueDto);
  }

  @Get('venues/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.venuesService.findOne(id);
  }

  @Patch('venues/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateVenueDto: UpdateVenueDto
  ) {
    return this.venuesService.update(id, updateVenueDto);
  }

  @Delete('venues/:id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.venuesService.remove(id);
  }

  @Get('activities')
  findActivities() {
    return this.venuesService.findActivities();
  }
}
