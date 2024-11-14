import { Album } from 'src/albums/album.model';
import { Artist } from 'src/artists/artist.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Track {
  @PrimaryColumn({ nullable: false })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null; // refers to Artist
  @ManyToOne(() => Artist, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId' })
  artist: string | null;

  @Column({ type: 'uuid', nullable: true })
  albumId: string | null; // refers to Album
  @ManyToOne(() => Album, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'albumId' })
  album: string | null;

  @Column()
  duration: number; // integer number
}
