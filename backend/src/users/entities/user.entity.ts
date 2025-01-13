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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    description: 'Identificador único del usuario',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Correo del usuario',
    type: 'string',
    example: 'customer@ua.es'
  })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @ApiProperty({
    description: 'Nombre real del usuario',
    type: 'string',
    example: 'Juan'
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    description: 'Apellidos del usuario',
    type: 'string',
    example: 'Rodríguez Bartolomeo'
  })
  @Column({ type: 'varchar', nullable: false })
  surname: string;

  @ApiProperty({
    description: 'Numero de teléfono español',
    type: 'string',
    example: '+34 966 00 00 00'
  })
  @Column({ type: 'varchar', unique: true, nullable: false })
  phone: string;

  @ApiProperty({
    description: 'Rol del usuario',
    type: 'string',
    enum: UserRole,
    example: UserRole.CUSTOMER
  })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @ApiProperty({
    description: 'Saldo del usuario',
    type: 'number',
    example: 100.5
  })
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

  @ApiProperty({
    description: 'Contraseñas del usuario',
    type: 'array'
  })
  @OneToMany(() => Password, (password) => password.user, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  passwords: Password[];

  // reservas creadas
  @ApiProperty({
    description: 'Bookings created by this user',
    type: 'array'
  })
  @OneToMany(() => Booking, (booked) => booked.appointer, {
    onDelete: 'SET NULL',
  })
  booked: Booking[];

  // reservas atendidas
  @ApiProperty({
    description: 'Bookings booked for this user',
    type: 'array'
  })
  @OneToMany(() => Booking, (booking) => booking.appointee, {
    onDelete: 'SET NULL',
  })
  bookings: Booking[];

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    type: 'string',
    example: '2025-03-11T18:30:00.000Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización del usuario',
    type: 'string',
    example: '2025-03-11T18:30:00.000Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Fecha de eliminación del usuario',
    type: 'string',
    example: '2025-03-11T18:30:00.000Z'
  })
  @DeleteDateColumn()
  deletedAt: Date;
}