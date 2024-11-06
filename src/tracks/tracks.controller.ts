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
import { ITrack } from 'src/interfaces';
import { TrackService } from './tracks.service';
import { GetTrackDto, UpdateTrackDto } from './dto/tracks.dto';

@Controller('track')
export class TracksController {
  constructor(private trackService: TrackService) {}

  @Get()
  async findAll(): Promise<ITrack[]> {
    const tracks = await this.trackService.findAll();
    if (!tracks)
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return tracks; // positive default statusCode 200
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<ITrack> {
    if (!isValidUuid(id))
      throw new HttpException('Invalid track id.', HttpStatus.BAD_REQUEST);

    const track = await this.trackService.getTrackById(id);
    if (!track)
      throw new HttpException('Track not found.', HttpStatus.NOT_FOUND);

    return track; // positive default statusCode 200
  }

  @Post()
  async create(@Body() body: GetTrackDto): Promise<ITrack> {
    if (
      ((typeof body.albumId === 'string' && body.albumId.trim() !== '') ||
        !body.albumId) &&
      ((typeof body.artistId === 'string' && body.artistId.trim() !== '') ||
        !body.artistId)
    ) {
      return await this.trackService.create(body); // positive default status code - 201 Created
    } else {
      throw new HttpException(
        'Invalid albumId or artistId, if defined -> should be not empty string or null',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTrackDto,
  ): Promise<ITrack> {
    if (!isValidUuid(id))
      throw new HttpException('Invalid track id.', HttpStatus.BAD_REQUEST);

    if (
      ((typeof body.albumId === 'string' && body.albumId.trim() !== '') ||
        !body.albumId) &&
      ((typeof body.artistId === 'string' && body.artistId.trim() !== '') ||
        !body.artistId)
    ) {
      const user = await this.trackService.getTrackById(id);
      if (!user)
        throw new HttpException('Track not found.', HttpStatus.NOT_FOUND);

      return this.trackService.update(id, body);
    } else {
      throw new HttpException(
        'Invalid albumId or artistId, if defined -> should be not empty string or null',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @HttpCode(204) // by default 204 if the record is found and deleted
  async delete(@Param('id') id: string) {
    if (!isValidUuid(id))
      throw new HttpException('Invalid track id.', HttpStatus.BAD_REQUEST);

    const track = await this.trackService.getTrackById(id);
    if (!track)
      throw new HttpException('Track not found.', HttpStatus.NOT_FOUND);

    return this.trackService.delete(id);
  }
}
