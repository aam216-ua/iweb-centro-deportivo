import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VenueStatus } from '../enums/venue-status.enum';
import { Activity } from './activity.entity';

@Entity()
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'integer' })
  capacity: number;

  @Column({ type: 'enum', enum: VenueStatus, default: VenueStatus.AVAILABLE })
  status: VenueStatus;

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

  @ManyToOne(() => Activity, (activity) => activity.venues, {
    nullable: false,
  })
  @JoinColumn()
  activity: Activity;
}
