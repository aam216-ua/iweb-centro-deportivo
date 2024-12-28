import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Venue } from './venue.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => Venue, (venue) => venue.activity)
  venues: Venue[];
}
