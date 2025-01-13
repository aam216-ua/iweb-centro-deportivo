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
  HttpStatus,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { QueryVenueDto } from './dto/query-venue.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Session } from 'src/auth/decorators/session.decorator';
import { UserSession } from 'src/auth/types/user-session.type';
import { UserRole } from 'src/users/enums/user-role.enum';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Venue } from './entities/venue.entity';
import { Activity } from './entities/activity.entity';

@Controller()
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @UseGuards(AuthGuard)
  @Post('venues')
  @ApiOperation({ summary: 'Crear una pista' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Venue })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  create(
    @Session() session: UserSession,
    @Body() createVenueDto: CreateVenueDto
  ) {
    if (session.role != UserRole.ADMIN && session.role != UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return this.venuesService.create(createVenueDto);
  }

  @Get('venues')
  @ApiOperation({ summary: 'Buscar pistas' })
  @ApiResponse({ status: HttpStatus.OK, type: [Venue] })
  findMany(@Query() queryVenueDto: QueryVenueDto) {
    return this.venuesService.findMany(queryVenueDto);
  }

  @Get('venues/:id')
  @ApiOperation({ summary: 'Buscar una pista' })
  @ApiResponse({ status: HttpStatus.OK, type: Venue })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.venuesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch('venues/:id')
  @ApiOperation({ summary: 'Actualizar una pista' })
  @ApiResponse({ status: HttpStatus.OK, type: Venue })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
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
  @ApiOperation({ summary: 'Eliminar una pista' })
  @ApiResponse({ status: HttpStatus.OK, type: Venue })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  remove(
    @Session() session: UserSession,
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    if (session.role != UserRole.ADMIN && session.role != UserRole.SUPERADMIN)
      throw new UnauthorizedException('insufficient permissions');

    return this.venuesService.remove(id);
  }

  @Get('activities')
  @ApiOperation({ summary: 'Buscar actividades' })
  @ApiResponse({ status: HttpStatus.OK, type: [Activity] })
  findActivities() {
    return this.venuesService.findActivities();
  }
}