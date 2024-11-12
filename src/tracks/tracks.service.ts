import { Injectable } from '@nestjs/common';
import { ITrack } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { FavRepo, TracksRepo } from 'src/db';
import { CreateTrackDto, UpdateTrackDto } from './dto/tracks.dto';

@Injectable()
export class TrackService {
  constructor(private tracksDB: TracksRepo, private favDB: FavRepo) {}

  async findAll(): Promise<ITrack[]> {
    try {
      const tracks = this.tracksDB.findAll();

      return Object.values(tracks);
    } catch (error) {
      console.log('findAll TrackService', error);
    }
  }

  async create(track: CreateTrackDto): Promise<ITrack> {
    try {
      const id = uuidv4();
      const newTrack = {
        ...track,
        artistId: track.artistId || null,
        albumId: track.albumId || null,
        id,
      };
      this.tracksDB.save(newTrack);

      return newTrack;
    } catch (error) {
      console.log('create TrackService', error);
    }
  }

  async getItemById(id: string) {
    try {
      return this.tracksDB.getById(id);
    } catch (error) {
      console.log('getTrackById TrackService', error);
    }
  }

  async update(id: string, body: UpdateTrackDto) {
    try {
      const track = this.tracksDB.getById(id);
      const updatedTrack = {
        ...track,
        ...body,
      };

      return this.tracksDB.update(updatedTrack);
    } catch (error) {
      console.log('update TrackService', error);
    }
  }

  async delete(id: string) {
    try {
      // remove form favorites if there
      const favDB = await this.favDB.findAll();
      if (favDB.tracks.includes(id)) {
        await this.favDB.delete('tracks', id);
      }

      return this.tracksDB.delete(id);
    } catch (error) {
      console.log('delete TrackService', error);
    }
  }
}
