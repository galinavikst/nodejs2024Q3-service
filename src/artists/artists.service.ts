import { Injectable } from '@nestjs/common';
import { IArtist } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.model';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsDB: Repository<Artist>,
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
      return await this.artistsDB.save({ ...body, id: artist.id });
    } catch (error) {
      console.log('update ArtistsService', error);
    }
  }

  async delete(id: string) {
    try {
      return await this.artistsDB.delete(id);
    } catch (error) {
      console.log('delete ArtistsService', error);
    }
  }
}
