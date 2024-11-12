import { Module, forwardRef } from '@nestjs/common';
import { HelperService } from './helper.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
  ],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
