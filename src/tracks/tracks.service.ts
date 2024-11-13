import { Injectable } from '@nestjs/common';
import { ITrack } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
//import { FavRepo } from 'src/db';
import { CreateTrackDto, UpdateTrackDto } from './dto/tracks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './track.model';
import { Repository } from 'typeorm';
import { Fav } from 'src/fav/fav.model';
import { FavService } from 'src/fav/fav.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private tracksDB: Repository<Track>,
    @InjectRepository(Fav)
    private favDB: Repository<Fav>, // private favService: FavService,
  ) {}

  async findAll(): Promise<ITrack[]> {
    try {
      const tracks = await this.tracksDB.find();

      return tracks;
    } catch (error) {
      console.log('findAll TrackService', error);
    }
  }

  async create(track: CreateTrackDto): Promise<ITrack> {
    try {
      const id = uuidv4();
      const newTrack = this.tracksDB.create({
        ...track,
        artistId: track.artistId || null,
        albumId: track.albumId || null,
        id,
      });

      const response = await this.tracksDB.save(newTrack);

      return response;
    } catch (error) {
      console.log('create TrackService', error);
    }
  }

  async getItemById(id: string) {
    try {
      const track = await this.tracksDB.findOneBy({ id });
      return track;
    } catch (error) {
      console.log('getTrackById TrackService', error);
    }
  }

  async update(id: string, body: UpdateTrackDto) {
    try {
      return await this.tracksDB.save({ ...body, id });
    } catch (error) {
      console.log('update TrackService', error);
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

      return await this.tracksDB.delete(id);
    } catch (error) {
      console.log('delete TrackService', error);
    }
  }
}
