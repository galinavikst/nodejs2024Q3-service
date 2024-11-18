import 'reflect-metadata'; // typeorm
import { DataSource } from 'typeorm';
import { User } from './users/user.model';
import { Album } from './albums/album.model';
import { Artist } from './artists/artist.model';
import { Fav } from './fav/fav.model';
import { Track } from './tracks/track.model';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
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
});
