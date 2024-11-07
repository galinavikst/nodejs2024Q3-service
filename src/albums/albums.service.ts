import { Injectable } from '@nestjs/common';
import { IAlbum } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { AlbumsRepo } from 'src/db';
import { CreateAlbumDto, GetAlbumDto } from './dto/albums.dto';
import { TrackService } from 'src/tracks/tracks.service';

@Injectable()
export class AlbumsService {
  constructor(
    private albumsDB: AlbumsRepo,
    private tracksService: TrackService,
  ) {}

  async findAll(): Promise<IAlbum[]> {
    try {
      const albums = this.albumsDB.findAll();

      return Object.values(albums);
    } catch (error) {
      console.log('findAll AlbumsService', error);
    }
  }

  async create(album: CreateAlbumDto): Promise<IAlbum> {
    try {
      const id = uuidv4();
      const newAlbum = {
        ...album,
        artistId: album.artistId || null,
        id,
      };
      this.albumsDB.save(newAlbum);

      return newAlbum;
    } catch (error) {
      console.log('create AlbumsService', error);
    }
  }

  async getAlbumById(id: string) {
    try {
      return this.albumsDB.getById(id);
    } catch (error) {
      console.log('getTrackById AlbumsService', error);
    }
  }

  async update(id: string, body: {}) {
    try {
      const track = this.albumsDB.getById(id);
      const updatedTrack = {
        ...track,
        ...body,
      };

      return this.albumsDB.update(updatedTrack);
    } catch (error) {
      console.log('update AlbumsService', error);
    }
  }

  async delete(id: string) {
    try {
      // set albumId: null in track
      const tracks = await this.tracksService.findAll();
      const tracksWithAlbum = tracks.filter((track) => track.albumId === id);
      for (const track of tracksWithAlbum) {
        await this.tracksService.update(track.id, { albumId: null });
      }

      return this.albumsDB.delete(id);
    } catch (error) {
      console.log('delete AlbumsService', error);
    }
  }
}
