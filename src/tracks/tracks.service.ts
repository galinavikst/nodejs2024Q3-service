import { Injectable } from '@nestjs/common';
import { ITrack, IUser } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { TracksRepo, UserRepo } from 'src/db';
import { plainToClass } from 'class-transformer';
import { CreateTrackDto, GetTrackDto } from './dto/tracks.dto';

@Injectable()
export class TrackService {
  constructor(private tracksDB: TracksRepo) {}

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

  async getTrackById(id: string) {
    try {
      return this.tracksDB.getById(id);
    } catch (error) {
      console.log('getTrackById TrackService', error);
    }
  }

  async update(id: string, body: {}) {
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
      return this.tracksDB.delete(id);
    } catch (error) {
      console.log('delete TrackService', error);
    }
  }
}
