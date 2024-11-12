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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favs')
export class FavController {
  constructor(
    private favService: FavService,
    private favDB: FavRepo,
    private helperService: HelperService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorite items' })
  async findAll(): Promise<IFavResponse> {
    const favs = await this.favService.findAll();
    if (!favs) throw new InternalServerErrorException();

    return favs;
  }

  @Post(':group/:id')
  @ApiOperation({ summary: 'Add fav item to related group' })
  @ApiParam({ name: 'id', description: 'item id to add' })
  @ApiParam({
    name: 'group',
    description: 'where to add',
    enum: ['track', 'album', 'artist'],
  })
  async create(
    @Param('group')
    group: string,
    @Param('id', new ParseUUIDPipe()) id: string, // 400 not uuid
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
  @ApiOperation({ summary: 'Delete fav item from related group' })
  @ApiParam({ name: 'id', description: 'item to delete' })
  @ApiParam({
    name: 'group',
    description: 'from where to delete',
    enum: ['track', 'album', 'artist'],
  })
  @HttpCode(204) // defalut positive the record is found and deleted
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string, // 400 id is not uuid
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
