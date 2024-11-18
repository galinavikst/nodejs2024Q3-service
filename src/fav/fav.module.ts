import { Module } from '@nestjs/common';
import { FavService } from './fav.service';
import { FavController } from './fav.controller';
import { HelperModule } from 'src/helper/helper.module';
import { Fav } from './fav.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Fav]), HelperModule],
  providers: [FavService],
  controllers: [FavController],
  exports: [TypeOrmModule],
})
export class FavModule {}
