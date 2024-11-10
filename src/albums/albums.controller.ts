import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { IAlbum } from 'src/interfaces';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/albums.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Albums')
@Controller('album')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Get()
  async findAll(): Promise<IAlbum[]> {
    const albums = await this.albumsService.findAll();
    if (!albums) throw new InternalServerErrorException();

    return albums; // positive default statusCode 200
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get all albums' })
  async getAlbumById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IAlbum> {
    const track = await this.albumsService.getItemById(id);
    if (!track) throw new NotFoundException();

    return track; // positive default statusCode 200
  }

  @Post()
  @ApiOperation({ summary: 'Create album' })
  @ApiBody({ type: CreateAlbumDto })
  async create(@Body() body: CreateAlbumDto): Promise<IAlbum> {
    if (
      (typeof body.artistId === 'string' && body.artistId.trim() !== '') ||
      !body.artistId
    ) {
      return await this.albumsService.create(body); // positive default status code - 201 Created
    } else {
      throw new BadRequestException(
        'Invalid artistId, if defined -> should be not empty string or null',
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update album' })
  @ApiBody({ type: [UpdateAlbumDto] })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateAlbumDto,
  ): Promise<IAlbum> {
    if (
      (typeof body.artistId === 'string' && body.artistId.trim() !== '') ||
      !body.artistId
    ) {
      const album = await this.albumsService.getItemById(id);
      if (!album) throw new NotFoundException();

      return this.albumsService.update(id, body);
    } else {
      throw new HttpException(
        'Invalid artistId, if defined -> should not be empty string or null',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete album' })
  @HttpCode(204) // by default 204 if the record is found and deleted
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const track = await this.albumsService.getItemById(id);
    if (!track) throw new NotFoundException();

    return this.albumsService.delete(id);
  }
}
