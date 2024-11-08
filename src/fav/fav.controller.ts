import {
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavService } from './fav.service';
import { IFavResponse } from 'src/interfaces';
import { FavRepo } from 'src/db';
import { HelperService } from 'src/helper/helper.service';

@Controller('favs')
export class FavController {
  constructor(
    private favService: FavService,
    private favDB: FavRepo,
    private helperService: HelperService,
  ) {}

  @Get()
  async findAll(): Promise<IFavResponse> {
    const favs = await this.favService.findAll();
    if (!favs) throw new InternalServerErrorException();

    return favs;
  }

  @Post(':group/:id')
  async create(
    @Param('group') group: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const favGroups = await this.helperService.createFavGroups('getItemById');

    if (!Object.keys(favGroups).includes(group))
      throw new UnprocessableEntityException('Invalid favorites group'); // 422

    const item = await favGroups[group].method(id);
    if (!item)
      throw new UnprocessableEntityException(
        `${group} with item ${id} does not exist`,
      );

    return this.favService.create(favGroups[group].field, id);
  }

  @Delete(':group/:id')
  @HttpCode(204) // defalut positive the record is found and deleted
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('group') group: string,
  ) {
    const favGroups = await this.helperService.createFavGroups('delete');

    if (!Object.keys(favGroups).includes(group))
      throw new UnprocessableEntityException('Invalid favorites group'); // 422

    // 404 if corresponding artist is not favorite
    const favDB: Record<string, string[]> = await this.favDB.findAll();
    if (!favDB[favGroups[group].field].includes(id))
      throw new NotFoundException();

    return this.favService.delete(favGroups[group].field, id);
  }
}
