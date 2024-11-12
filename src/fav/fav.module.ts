import { Module } from '@nestjs/common';
import { FavService } from './fav.service';
import { FavController } from './fav.controller';
import { FavRepo } from 'src/db';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [HelperModule],
  providers: [FavRepo, FavService],
  controllers: [FavController],
  exports: [FavService, FavRepo],
})
export class FavModule {}
