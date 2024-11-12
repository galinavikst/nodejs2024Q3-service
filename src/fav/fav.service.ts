import { Injectable } from '@nestjs/common';
import { FavRepo } from 'src/db';
import { HelperService } from 'src/helper/helper.service';
import { IFavResponse } from 'src/interfaces';

@Injectable()
export class FavService {
  constructor(private favDB: FavRepo, private helperService: HelperService) {}

  async findAll(): Promise<IFavResponse> {
    try {
      const favDB = await this.favDB.findAll();

      return await this.helperService.getFavs(favDB);
    } catch (error) {
      console.log('findAll favService', error);
    }
  }

  async create(field: string, id: string): Promise<string> {
    try {
      await this.favDB.save(field, id);

      return `${id} added to ${field}`;
    } catch (error) {
      console.log('create favService', error);
    }
  }

  async delete(field: string, id: string) {
    try {
      await this.favDB.delete(field, id);

      return `${id} deleted from ${field}`;
    } catch (error) {
      console.log('delete favService', error);
    }
  }
}
