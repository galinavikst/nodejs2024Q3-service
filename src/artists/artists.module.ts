import { Module } from '@nestjs/common';
import { ArtistsRepo } from 'src/db';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  imports: [AlbumsModule, TracksModule],
  controllers: [ArtistsController],
  providers: [ArtistsRepo, ArtistsService],
  exports: [],
})
export class ArtistsModule {}
