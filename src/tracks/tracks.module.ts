import { Module } from '@nestjs/common';
import { TracksRepo } from 'src/db';
import { TrackService } from './tracks.service';
import { TracksController } from './tracks.controller';

@Module({
  controllers: [TracksController],
  providers: [TracksRepo, TrackService],
  exports: [TrackService],
})
export class TracksModule {}
