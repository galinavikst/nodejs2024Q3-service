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
import { IArtist } from 'src/interfaces';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('artist')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Get()
  async findAll(): Promise<IArtist[]> {
    const artists = await this.artistsService.findAll();
    if (!artists)
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return artists; // positive default statusCode 200
  }

  @Get(':id')
  async getArtistById(@Param('id') id: string): Promise<IArtist> {
    if (!isValidUuid(id))
      throw new HttpException('Invalid id.', HttpStatus.BAD_REQUEST);

    const artist = await this.artistsService.getArtistById(id);
    if (!artist)
      throw new HttpException('Artist not found.', HttpStatus.NOT_FOUND);

    return artist; // positive default statusCode 200
  }

  @Post()
  @ApiBody({ type: CreateArtistDto })
  async create(@Body() body: CreateArtistDto): Promise<IArtist> {
    return await this.artistsService.create(body); // positive default status code - 201 Created
  }

  @Put(':id')
  @ApiBody({ type: UpdateArtistDto })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateArtistDto,
  ): Promise<IArtist> {
    if (!isValidUuid(id))
      throw new HttpException('Invalid id.', HttpStatus.BAD_REQUEST);

    const artist = await this.artistsService.getArtistById(id);
    if (!artist)
      throw new HttpException('Artist not found.', HttpStatus.NOT_FOUND);

    return this.artistsService.update(artist, body);
  }

  @Delete(':id')
  @HttpCode(204) // by default 204 if the record is found and deleted
  async delete(@Param('id') id: string) {
    if (!isValidUuid(id))
      throw new HttpException('Invalid id.', HttpStatus.BAD_REQUEST);

    const artist = await this.artistsService.getArtistById(id);
    if (!artist)
      throw new HttpException('Artist not found.', HttpStatus.NOT_FOUND);

    return this.artistsService.delete(id);
  }
}
