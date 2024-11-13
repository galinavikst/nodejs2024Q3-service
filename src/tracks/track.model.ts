import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Track {
  @PrimaryColumn({ nullable: false })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null; // refers to Artist

  @Column({ nullable: true })
  albumId: string | null; // refers to Album

  @Column()
  duration: number; // integer number
}
