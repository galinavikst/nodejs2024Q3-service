import { Module, forwardRef } from '@nestjs/common';
import { FavService } from './fav.service';
import { FavController } from './fav.controller';
import { HelperModule } from 'src/helper/helper.module';
import { Fav } from './fav.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fav]),
    forwardRef(() => AlbumsModule),
    //forwardRef(() => HelperModule),
    HelperModule,
  ],
  providers: [FavService],
  controllers: [FavController],
  exports: [FavService, TypeOrmModule],
})
export class FavModule {}
