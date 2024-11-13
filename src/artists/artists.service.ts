import { Injectable } from '@nestjs/common';
import { IArtist } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { AlbumsService } from 'src/albums/albums.service';
import { TrackService } from 'src/tracks/tracks.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Fav } from 'src/fav/fav.model';
import { Repository } from 'typeorm';
import { Artist } from './artist.model';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Fav)
    private favDB: Repository<Fav>,
    @InjectRepository(Artist)
    private artistsDB: Repository<Artist>,
    private albumsService: AlbumsService,
    private tracksService: TrackService,
  ) {}

  async findAll(): Promise<IArtist[]> {
    try {
      return this.artistsDB.find();
    } catch (error) {
      console.log('findAll ArtistsService', error);
    }
  }

  async create(artist: CreateArtistDto): Promise<IArtist> {
    try {
      const id = uuidv4();
      const newArtist = this.artistsDB.create({
        ...artist,
        id,
      });
      const response = await this.artistsDB.save(newArtist);

      return response;
    } catch (error) {
      console.log('create ArtistsService', error);
    }
  }

  async getItemById(id: string) {
    try {
      return await this.artistsDB.findOneBy({ id });
    } catch (error) {
      console.log('getUserById ArtistsService', error);
    }
  }

  async update(artist: IArtist, body: UpdateArtistDto) {
    try {
      const updatedArtist = {
        ...artist,
        ...body,
      };

      return await this.artistsDB.save({ ...body, id: artist.id });
    } catch (error) {
      console.log('update ArtistsService', error);
    }
  }

  async delete(id: string) {
    try {
      // remove form favorites if there
      const favDB = await this.favDB.find();
      const favObj = favDB[0];
      if (favObj.artists.includes(id)) {
        const updated = favObj.tracks.filter((item) => item !== id);
        favObj.artists = updated;
        await this.favDB.save(favObj);
      }

      // update albums with artstId: null
      const albums = await this.albumsService.findAll();
      const albumsWithArtist = albums.filter((album) => album.artistId === id);
      for (const album of albumsWithArtist) {
        await this.albumsService.update(album.id, { artistId: null });
      }

      // update tracks with artstId: null, albumId: null
      const tracks = await this.tracksService.findAll();
      const tracksWithArtist = tracks.filter((track) => track.artistId === id);
      for (const track of tracksWithArtist) {
        await this.tracksService.update(track.id, {
          artistId: null,
          albumId: null,
        });
      }

      return await this.artistsDB.delete(id);
    } catch (error) {
      console.log('delete ArtistsService', error);
    }
  }
}
