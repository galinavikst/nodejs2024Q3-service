import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/helper/helper.service';
import { IFav, IFavResponse } from 'src/interfaces';
import { Repository } from 'typeorm';
import { Fav } from './fav.model';

@Injectable()
export class FavService {
  constructor(
    @InjectRepository(Fav)
    private favDB: Repository<Fav>,
    private helperService: HelperService,
  ) {}

  async findAll(): Promise<IFavResponse> {
    try {
      let favs: IFav;
      const [favObj] = await this.favDB.find(); // get only item

      if (!favObj) favs = { artists: [], albums: [], tracks: [] };
      else favs = favObj;

      return await this.helperService.getFavs(favs);
    } catch (error) {
      console.log('findAll favService', error);
    }
  }

  async create(field: string, id: string): Promise<string> {
    try {
      let favs: IFav;
      const [favObj] = await this.favDB.find(); // get only item
      if (!favObj) favs = { artists: [], albums: [], tracks: [] };
      else favs = favObj;

      if (!favs[field].includes(id)) {
        favs[field].push(id);
        await this.favDB.save(favs);

        return `${id} added to ${field}`;
      } else return `${id} alredy exist in favorites ${field}`;
    } catch (error) {
      console.log('create favService', error);
    }
  }

  async delete(group: string, id: string) {
    try {
      // remove form favorites if there
      let favs: IFav;
      const [favObj] = await this.favDB.find(); // get only item
      if (!favObj) favs = { artists: [], albums: [], tracks: [] };
      else favs = favObj;

      favs[group] = favs[group].filter((item: string) => item !== id);
      await this.favDB.save(favs);

      return `${id} removed from ${group}`;
    } catch (error) {
      console.log('delete favService', error);
    }
  }
}
