import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Password {
  @ApiProperty({
    description: 'Identificador único de la contraseña',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Usuario al que pertenece la contraseña',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ManyToOne(() => User, (user) => user.passwords)
  @JoinColumn()
  user: User;

  @ApiProperty({
    description: 'Contraseña del usuario',
    type: 'string',
    example: 'Password123#',
  })
  @Column({ type: 'varchar' })
  password: string;

  @ApiProperty({
    description: 'Fecha de creación de la contraseña',
    type: 'string',
    example: '2025-03-11T18:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de eliminación de la contraseña',
    type: 'string',
    example: '2025-03-11T18:30:00.000Z',
  })
  @DeleteDateColumn()
  deletedAt: Date;
}
