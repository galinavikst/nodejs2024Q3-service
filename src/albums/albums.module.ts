import { Module } from '@nestjs/common';
import { AlbumsRepo } from 'src/db';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  imports: [TracksModule],
  controllers: [AlbumsController],
  providers: [AlbumsRepo, AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
