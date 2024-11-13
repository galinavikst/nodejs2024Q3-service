import { Module, forwardRef } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavModule } from 'src/fav/fav.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fav } from 'src/fav/fav.model';
import { Album } from './album.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => FavModule),
    forwardRef(() => TracksModule),
    //TypeOrmModule.forFeature([Fav]),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
