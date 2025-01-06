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

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'enum', enum: BookingTurn, nullable: false })
  turn: BookingTurn;

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
  @ManyToOne(() => User, (appointer) => appointer, {
    nullable: false,
  })
  appointer: User;

  // persona que atiende a la reserva
  @ManyToOne(() => User, (appointee) => appointee.bookings, {
    nullable: false,
  })
  appointee: User;

  @ManyToOne(() => Venue, (venue) => venue.bookings, {
    nullable: false,
  })
  venue: Venue;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
