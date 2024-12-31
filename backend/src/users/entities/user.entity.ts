import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Password } from './password.entity';
import { UserRole } from '../enums/user-role.enum';
import { Exclude } from 'class-transformer';
import { Booking } from 'src/bookings/entities/booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  surname: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    transformer: {
      to: (value: number): number => value,
      from: (value: string): number => parseFloat(value),
    },
    default: 0,
  })
  balance: number;

  @OneToMany(() => Password, (password) => password.user, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  passwords: Password[];

  // reservas creadas
  @OneToMany(() => Booking, (booked) => booked.appointer, {
    onDelete: 'SET NULL',
  })
  booked: Booking[];

  // reservas atendidas
  @OneToMany(() => Booking, (booking) => booking.appointee, {
    onDelete: 'SET NULL',
  })
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
