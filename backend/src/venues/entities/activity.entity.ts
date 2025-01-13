import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Venue } from './venue.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Activity {
  @ApiProperty({
    description: 'Identificador único de la actividad',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la actividad',
    type: 'string',
    example: 'football',
  })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({ 
    description: 'Listado de pistas de la actividad',
    type: 'array',
  })
  @OneToMany(() => Venue, (venue) => venue.activity, {
    onDelete: 'RESTRICT',
  })
  venues: Venue[];
}
