import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Fav {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  artists: string[]; // favorite artists ids

  @Column('simple-array')
  albums: string[]; // favorite albums ids

  @Column('simple-array')
  tracks: string[]; // favorite tracks ids
}
