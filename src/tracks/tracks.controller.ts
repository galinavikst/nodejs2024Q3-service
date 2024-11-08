import {
  BadRequestException,
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
import { ITrack } from 'src/interfaces';
import { TrackService } from './tracks.service';
import { CreateTrackDto, UpdateTrackDto } from './dto/tracks.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('track')
export class TracksController {
  constructor(private trackService: TrackService) {}

  @Get()
  async findAll(): Promise<ITrack[]> {
    const tracks = await this.trackService.findAll();
    if (!tracks) throw new InternalServerErrorException();

    return tracks; // positive default statusCode 200
  }

  @Get(':id')
  async getTrackById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ITrack> {
    const track = await this.trackService.getItemById(id);
    if (!track) throw new NotFoundException();

    return track; // positive default statusCode 200
  }

  @Post()
  @ApiBody({ type: [CreateTrackDto] })
  async create(@Body() body: CreateTrackDto): Promise<ITrack> {
    if (
      ((typeof body.albumId === 'string' && body.albumId.trim() !== '') ||
        !body.albumId) &&
      ((typeof body.artistId === 'string' && body.artistId.trim() !== '') ||
        !body.artistId)
    ) {
      return await this.trackService.create(body); // positive default status code - 201 Created
    } else {
      throw new BadRequestException(
        'Invalid albumId or artistId, if defined -> should be not empty string or null',
      );
    }
  }

  @Put(':id')
  @ApiBody({ type: [UpdateTrackDto] })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTrackDto,
  ): Promise<ITrack> {
    if (
      ((typeof body.albumId === 'string' && body.albumId.trim() !== '') ||
        !body.albumId) &&
      ((typeof body.artistId === 'string' && body.artistId.trim() !== '') ||
        !body.artistId)
    ) {
      const user = await this.trackService.getItemById(id);
      if (!user) throw new NotFoundException();

      return this.trackService.update(id, body);
    } else {
      throw new BadRequestException(
        'Invalid albumId or artistId, if defined -> should be not empty string or null',
      );
    }
  }

  @Delete(':id')
  @HttpCode(204) // by default 204 if the record is found and deleted
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const track = await this.trackService.getItemById(id);
    if (!track) throw new NotFoundException();

    return this.trackService.delete(id);
  }
}
