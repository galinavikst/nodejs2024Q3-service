import { Injectable } from '@nestjs/common';
import { IAlbum } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { AlbumsRepo, FavRepo } from 'src/db';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/albums.dto';
import { TrackService } from 'src/tracks/tracks.service';

@Injectable()
export class AlbumsService {
  constructor(
    private albumsDB: AlbumsRepo,
    private favDB: FavRepo,
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

  async getItemById(id: string) {
    try {
      return this.albumsDB.getById(id);
    } catch (error) {
      console.log('getTrackById AlbumsService', error);
    }
  }

  async update(id: string, body: UpdateAlbumDto) {
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
      // remove form favorites if there
      const favDB = await this.favDB.findAll();
      if (favDB.albums.includes(id)) {
        await this.favDB.delete('albums', id);
      }

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
