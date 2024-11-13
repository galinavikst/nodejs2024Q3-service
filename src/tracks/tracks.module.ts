import { Module, forwardRef } from '@nestjs/common';
import { TrackService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './track.model';
import { Fav } from 'src/fav/fav.model';
import { AlbumsModule } from 'src/albums/albums.module';
import { FavModule } from 'src/fav/fav.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    TypeOrmModule.forFeature([Fav]),
    forwardRef(() => AlbumsModule),
    forwardRef(() => FavModule),
  ],
  controllers: [TracksController],
  providers: [TrackService],
  exports: [TypeOrmModule, TrackService],
})
export class TracksModule {}
