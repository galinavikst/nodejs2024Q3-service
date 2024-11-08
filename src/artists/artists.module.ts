import { Module, forwardRef } from '@nestjs/common';
import { ArtistsRepo } from 'src/db';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavModule } from 'src/fav/fav.module';

@Module({
  imports: [
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
    forwardRef(() => FavModule),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsRepo, ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
