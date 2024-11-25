import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { FavModule } from './fav/fav.module';
import { HelperModule } from './helper/helper.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Album } from './albums/album.model';
import { Artist } from './artists/artist.model';
import { Fav } from './fav/fav.model';
import { Track } from './tracks/track.model';
import { User } from './users/user.model';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { HeaderMiddleware } from './middlewares/header.middleware';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    UsersModule,
    TracksModule,
    AlbumsModule,
    ArtistsModule,
    FavModule,
    HelperModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [AuthModule, ConfigModule, LoggerModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: configService.get('DB_SYNCHRONIZE'),
        logging: configService.get('DB_LOGGING'),
        entities: [User, Track, Fav, Artist, Album],
        migrations: ['dist/migrations/*.{js,ts}'],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), LoggerMiddleware, HeaderMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/signup', method: RequestMethod.POST },
        //{ path: '/auth/refresh', method: RequestMethod.POST },
        { path: '/doc', method: RequestMethod.GET },
        { path: '/', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
