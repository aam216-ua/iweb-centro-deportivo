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
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { QueryVenueDto } from './dto/query-venue.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Session } from 'src/auth/decorators/session.decorator';
import { UserSession } from 'src/auth/types/user-session.type';
import { UserRole } from 'src/users/enums/user-role.enum';

@Controller()
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @UseGuards(AuthGuard)
  @Post('venues')
  create(
    @Session() session: UserSession,
    @Body() createVenueDto: CreateVenueDto
  ) {
    if (session.role != UserRole.ADMIN && session.role != UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return this.venuesService.create(createVenueDto);
  }

  @Get('venues')
  findMany(@Query() queryVenueDto: QueryVenueDto) {
    return this.venuesService.findMany(queryVenueDto);
  }

  @Get('venues/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.venuesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch('venues/:id')
  update(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateVenueDto: UpdateVenueDto
  ) {
    if (session.role != UserRole.ADMIN && session.role != UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return this.venuesService.update(id, updateVenueDto);
  }

  @UseGuards(AuthGuard)
  @Delete('venues/:id')
  remove(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    if (session.role != UserRole.ADMIN && session.role != UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return this.venuesService.remove(id);
  }

  @Get('activities')
  findActivities() {
    return this.venuesService.findActivities();
  }
}
