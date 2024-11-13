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
      host: 'localhost',
      port: 8080, // postgres post / default 5432 but I installed with 8080
      username: 'postgres', // postgres default name
      password: 'halynavs89', // postgres pass when registered
      database: 'home',
      synchronize: true,
      logging: true,
      entities: [User],
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
