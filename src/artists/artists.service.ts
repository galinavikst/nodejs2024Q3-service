import { Injectable } from '@nestjs/common';
import { IArtist } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { ArtistsRepo } from 'src/db';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { AlbumsService } from 'src/albums/albums.service';
import { TrackService } from 'src/tracks/tracks.service';

@Injectable()
export class ArtistsService {
  constructor(
    private artistsDB: ArtistsRepo,
    private albumsService: AlbumsService,
    private tracksService: TrackService,
  ) {}

  async findAll(): Promise<IArtist[]> {
    try {
      return Object.values(this.artistsDB.findAll());
    } catch (error) {
      console.log('findAll ArtistsService', error);
    }
  }

  async create(artist: CreateArtistDto): Promise<IArtist> {
    try {
      const id = uuidv4();
      const newArtist = {
        ...artist,
        id,
      };
      this.artistsDB.save(newArtist);

      return newArtist;
    } catch (error) {
      console.log('create ArtistsService', error);
    }
  }

  async getArtistById(id: string) {
    try {
      return this.artistsDB.getById(id);
    } catch (error) {
      console.log('getUserById ArtistsService', error);
    }
  }

  async update(artist: IArtist, body: UpdateArtistDto) {
    try {
      //const artist = this.artistsDB.getById(id);
      const updatedArtist = {
        ...artist,
        ...body,
      };

      return this.artistsDB.update(updatedArtist);
    } catch (error) {
      console.log('update ArtistsService', error);
    }
  }

  async delete(id: string) {
    try {
      // update albums with artstId: null
      const albums = await this.albumsService.findAll();
      const albumsWithArtist = albums.filter((album) => album.artistId === id);
      for (let album of albumsWithArtist) {
        await this.albumsService.update(album.id, { artistId: null });
      }

      // update tracks with artstId: null, albumId: null
      const tracks = await this.tracksService.findAll();
      const tracksWithArtist = tracks.filter((track) => track.artistId === id);
      for (const track of tracksWithArtist) {
        await this.tracksService.update(track.id, {
          artistId: null,
          albumId: null, // it wasn't in the task but seems logical
        });
      }

      return await this.artistsDB.delete(id);
    } catch (error) {
      console.log('delete ArtistsService', error);
    }
  }
}
