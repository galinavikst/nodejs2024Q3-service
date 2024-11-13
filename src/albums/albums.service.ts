import { Injectable } from '@nestjs/common';
import { IAlbum } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/albums.dto';
import { TrackService } from 'src/tracks/tracks.service';
import { FavService } from 'src/fav/fav.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fav } from 'src/fav/fav.model';
import { Album } from './album.model';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsDB: Repository<Album>,
    private tracksService: TrackService,
    @InjectRepository(Fav)
    private favDB: Repository<Fav>, //private favService: FavService,
  ) {}

  async findAll(): Promise<IAlbum[]> {
    try {
      const albums = this.albumsDB.find();

      return albums;
    } catch (error) {
      console.log('findAll AlbumsService', error);
    }
  }

  async create(album: CreateAlbumDto): Promise<IAlbum> {
    try {
      const id = uuidv4();
      const newAlbum = this.albumsDB.create({
        ...album,
        artistId: album.artistId || null,
        id,
      });

      return await this.albumsDB.save(newAlbum);
    } catch (error) {
      console.log('create AlbumsService', error);
    }
  }

  async getItemById(id: string) {
    try {
      return await this.albumsDB.findOneBy({ id });
    } catch (error) {
      console.log('getTrackById AlbumsService', error);
    }
  }

  async update(id: string, body: UpdateAlbumDto) {
    try {
      const track = await this.albumsDB.findOneBy({ id });
      const updatedTrack = {
        ...track,
        ...body,
      };

      return await this.albumsDB.save({ id, ...body });
    } catch (error) {
      console.log('update AlbumsService', error);
    }
  }

  async delete(id: string) {
    try {
      // remove form favorites if there
      const favDB = await this.favDB.find();
      const favObj = favDB[0];
      if (favObj.tracks.includes(id)) {
        const updatedTracks = favObj.tracks.filter((item) => item !== id);
        favObj.tracks = updatedTracks;
        await this.favDB.save(favObj);
      }
      //await this.favService.delete('albums', id);

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
