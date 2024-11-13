import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Album {
  @PrimaryColumn({ nullable: false })
  id: string; // uuid v4

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null; // refers to Artist
}
