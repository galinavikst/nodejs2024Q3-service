import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { FavModule } from './fav/fav.module';
import { HelperModule } from './helper/helper.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.model';
import { DataSource } from 'typeorm';
import 'reflect-metadata'; // typeorm
import { Track } from './tracks/track.model';
import { Fav } from './fav/fav.model';
import { Artist } from './artists/artist.model';
import { Album } from './albums/album.model';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    UsersModule,
    TracksModule,
    AlbumsModule,
    ArtistsModule,
    FavModule,
    HelperModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT, // postgres post / default 5432 but I installed with 8080
      username: process.env.DB_USERNAME, // postgres default name
      password: process.env.DB_PASSWORD, // postgres pass when registered
      database: process.env.DB_DATABASE,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
      entities: [User, Track, Fav, Artist, Album],
      subscribers: [],
      migrations: [],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
