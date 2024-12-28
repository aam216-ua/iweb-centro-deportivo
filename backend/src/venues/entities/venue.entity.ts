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

  @Column({ type: 'money' })
  fee: number;

  @ManyToOne(() => Activity, (activity) => activity.venues)
  @JoinColumn()
  activity: Activity;
}
