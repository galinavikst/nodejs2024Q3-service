import { Injectable } from '@nestjs/common';
import { IAlbum } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/albums.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.model';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsDB: Repository<Album>,
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
      throw new Error(error);
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
      return await this.albumsDB.save({ id, ...body });
    } catch (error) {
      console.log('update AlbumsService', error);
    }
  }

  async delete(id: string) {
    try {
      return await this.albumsDB.delete(id);
    } catch (error) {
      console.log('delete AlbumsService', error);
    }
  }
}
