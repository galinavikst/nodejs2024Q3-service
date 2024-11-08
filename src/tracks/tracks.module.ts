import { Module } from '@nestjs/common';
import { TracksRepo } from 'src/db';
import { TrackService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { FavModule } from 'src/fav/fav.module';

@Module({
  imports: [FavModule],
  controllers: [TracksController],
  providers: [TracksRepo, TrackService],
  exports: [TrackService],
})
export class TracksModule {}
