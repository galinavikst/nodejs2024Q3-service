import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { IArtist } from 'src/interfaces';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Artists')
@Controller('artist')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  async findAll(): Promise<IArtist[]> {
    const artists = await this.artistsService.findAll();
    if (!artists) throw new InternalServerErrorException();

    return artists; // positive default statusCode 200
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get artist by id' })
  async getArtistById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IArtist> {
    const artist = await this.artistsService.getItemById(id);
    if (!artist) throw new NotFoundException();

    return artist; // positive default statusCode 200
  }

  @Post()
  @ApiOperation({ summary: 'Create artist' })
  @ApiBody({ type: CreateArtistDto })
  async create(@Body() body: CreateArtistDto): Promise<IArtist> {
    return await this.artistsService.create(body); // positive default status code - 201 Created
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artist' })
  @ApiBody({ type: UpdateArtistDto })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateArtistDto,
  ): Promise<IArtist> {
    const artist = await this.artistsService.getItemById(id);
    if (!artist) throw new NotFoundException();

    return this.artistsService.update(artist, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete artist' })
  @HttpCode(204) // by default 204 if the record is found and deleted
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const artist = await this.artistsService.getItemById(id);
    if (!artist) throw new NotFoundException();

    return this.artistsService.delete(id);
  }
}
