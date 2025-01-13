import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venues/entities/venue.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingTurn } from '../enums/booking-turn.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Booking {
  @ApiProperty({
    description: 'UUID de la reserva',
    type: 'string',
    example: '08a5c4ff-f1a8-4bbd-b48f-f1fa9b86ddfd',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Día en el que ocurre la reserva',
    type: 'string',
    example: '2025-03-11',
  })
  @Column({ type: 'date', nullable: false })
  date: Date;

  @ApiProperty({
    description: 'Turno en el que ocurre la reserva',
    type: 'string',
    enum: BookingTurn,
    example: BookingTurn.TURN_09_30,
  })
  @Column({ type: 'enum', enum: BookingTurn, nullable: false })
  turn: BookingTurn;

  @ApiProperty({
    description: 'Precio de la reserva',
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

  // persona que crea la reserva
  @ApiProperty({
    description: 'UUID del usuario que crea la reserva',
    type: 'string',
    example: '08a5c4ff-f1a8-4bbd-b48f-f1fa9b86ddfd',
  })
  @ManyToOne(() => User, (appointer) => appointer, {
    nullable: false,
  })
  appointer: User;

  // persona que atiende a la reserva
  @ApiProperty({
    description: 'UUID del usuario que atiende a la reserva',
    type: 'string',
    example: '08a5c4ff-f1a8-4bbd-b48f-f1fa9b86ddfd',
  })
  @ManyToOne(() => User, (appointee) => appointee.bookings, {
    nullable: false,
  })
  appointee: User;

  // pista en la que ocurre la reserva
  @ApiProperty({
    description: 'UUID de la pista en la que ocurre la reserva',
    type: 'string',
    example: '08a5c4ff-f1a8-4bbd-b48f-f1fa9b86ddfd',
  })
  @ManyToOne(() => Venue, (venue) => venue.bookings, {
    nullable: false,
  })
  venue: Venue;

  @ApiProperty({
    description: 'Fecha de creación de la reserva',
    type: 'string',
    example: '2025-03-11T18:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización de la reserva',
    type: 'string',
    example: '2025-03-11T18:30:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
