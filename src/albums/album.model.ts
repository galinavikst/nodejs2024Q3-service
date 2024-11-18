import { Artist } from 'src/artists/artist.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Album {
  @PrimaryColumn({ nullable: false })
  id: string; // uuid v4

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;
  @ManyToOne(() => Artist, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId' }) // Join with the artistId column
  artist: string | null;
}
