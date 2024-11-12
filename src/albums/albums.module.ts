import { Module, forwardRef } from '@nestjs/common';
import { AlbumsRepo } from 'src/db';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavModule } from 'src/fav/fav.module';

@Module({
  imports: [forwardRef(() => TracksModule), forwardRef(() => FavModule)],
  controllers: [AlbumsController],
  providers: [AlbumsRepo, AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
