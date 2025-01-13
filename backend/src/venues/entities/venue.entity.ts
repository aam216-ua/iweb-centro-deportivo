import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VenueStatus } from '../enums/venue-status.enum';
import { Activity } from './activity.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Venue {
  @ApiProperty({
    description: 'Identificador único de la pista',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la pista',
    type: 'string',
    example: 'pista de futbol 3',
  })
  @Column({ type: 'varchar', unique: true })
  name: string;

  @ApiProperty({
    description: 'Descripción de la pista',
    type: 'string',
    example: 'pista de futbol azul interior',
  })
  @Column({ type: 'varchar' })
  description: string;

  @ApiProperty({
    description: 'Capacidad de la pista',
    type: 'integer',
    example: 10,
  })
  @Column({ type: 'integer' })
  capacity: number;

  @ApiProperty({
    description: 'Estado de la pista',
    type: 'string',
    enum: VenueStatus,
    example: VenueStatus.AVAILABLE,
  })
  @Column({ type: 'enum', enum: VenueStatus, default: VenueStatus.AVAILABLE })
  status: VenueStatus;

  @ApiProperty({
    description: 'Precio de la pista',
    type: 'number',
    example: 15.5,
  })
  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    transformer: {
      to: (value: number): number => value,
      from: (value: string): number => parseFloat(value),
    },
    nullable: false,
  })
  fee: number;

  @ApiProperty({
    description: 'Actividad a la que pertenece la pista',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ManyToOne(() => Activity, (activity) => activity.venues, {
    nullable: false,
  })
  @JoinColumn()
  activity: Activity;

  @ApiProperty({
    description: 'Listado de reservas de la pista',
    type: 'array',
  })
  @OneToMany(() => Booking, (booking) => booking.venue)
  bookings: Booking[];

  @ApiProperty({
    description: 'Fecha de creación de la pista',
    type: 'string',
    example: '2025-03-11T18:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización de la pista',
    type: 'string',
    example: '2025-03-11T18:30:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
