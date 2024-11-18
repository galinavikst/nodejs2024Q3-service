import { Module } from '@nestjs/common';
import { TrackService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './track.model';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  controllers: [TracksController],
  providers: [TrackService],
  exports: [TypeOrmModule, TrackService],
})
export class TracksModule {}
