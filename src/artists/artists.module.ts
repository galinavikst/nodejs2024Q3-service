import { Module, forwardRef } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavModule } from 'src/fav/fav.module';
import { Fav } from 'src/fav/fav.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.model';

@Module({
  imports: [
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
    TypeOrmModule.forFeature([Artist]),
    TypeOrmModule.forFeature([Fav]),
    forwardRef(() => FavModule),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
