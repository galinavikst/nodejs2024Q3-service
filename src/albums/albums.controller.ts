import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { validate as isValidUuid } from 'uuid';
import { IAlbum, ITrack } from 'src/interfaces';
import { AlbumsService } from './albums.service';
import { GetAlbumDto, UpdateAlbumDto } from './dto/albums.dto';

@Controller('album')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Get()
  async findAll(): Promise<IAlbum[]> {
    const albums = await this.albumsService.findAll();
    if (!albums)
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return albums; // positive default statusCode 200
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string): Promise<IAlbum> {
    if (!isValidUuid(id))
      throw new HttpException('Invalid album id.', HttpStatus.BAD_REQUEST);

    const track = await this.albumsService.getAlbumById(id);
    if (!track)
      throw new HttpException('Album not found.', HttpStatus.NOT_FOUND);

    return track; // positive default statusCode 200
  }

  @Post()
  async create(@Body() body: GetAlbumDto): Promise<IAlbum> {
    if (
      (typeof body.artistId === 'string' && body.artistId.trim() !== '') ||
      !body.artistId
    ) {
      return await this.albumsService.create(body); // positive default status code - 201 Created
    } else {
      throw new HttpException(
        'Invalid artistId, if defined -> should be not empty string or null',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAlbumDto,
  ): Promise<IAlbum> {
    if (!isValidUuid(id))
      throw new HttpException('Invalid album id.', HttpStatus.BAD_REQUEST);

    if (
      (typeof body.artistId === 'string' && body.artistId.trim() !== '') ||
      !body.artistId
    ) {
      const album = await this.albumsService.getAlbumById(id);
      if (!album)
        throw new HttpException('Album not found.', HttpStatus.NOT_FOUND);

      return this.albumsService.update(id, body);
    } else {
      throw new HttpException(
        'Invalid artistId, if defined -> should not be empty string or null',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @HttpCode(204) // by default 204 if the record is found and deleted
  async delete(@Param('id') id: string) {
    if (!isValidUuid(id))
      throw new HttpException('Invalid album id.', HttpStatus.BAD_REQUEST);

    const track = await this.albumsService.getAlbumById(id);
    if (!track)
      throw new HttpException('Track not found.', HttpStatus.NOT_FOUND);

    return this.albumsService.delete(id);
  }
}
