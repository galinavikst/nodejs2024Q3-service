import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { FavModule } from './fav/fav.module';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [
    UsersModule,
    TracksModule,
    AlbumsModule,
    ArtistsModule,
    FavModule,
    HelperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
