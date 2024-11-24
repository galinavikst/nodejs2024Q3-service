import {
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { FavService } from './fav.service';
import { IFav, IFavResponse } from 'src/interfaces';
import { HelperService } from 'src/helper/helper.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Fav } from './fav.model';
import { Repository } from 'typeorm';
import { CombinedAuthGuard } from 'src/auth/auth.guard';

//@UseGuards(AuthGuard)
@UseGuards(CombinedAuthGuard)
@ApiTags('Favorites')
@Controller('favs')
export class FavController {
  //private readonly logger = new Logger(FavController.name);

  constructor(
    @InjectRepository(Fav)
    private favDB: Repository<Fav>,
    private favService: FavService,
    private helperService: HelperService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorite items' })
  async findAll(@Request() req): Promise<IFavResponse> {
    const { url, query, body } = req;
    //this.logger.log(`Request: ${url}, ${query}, ${body}`);

    const favs = await this.favService.findAll();
    if (!favs) {
      //this.logger.error('500 error');
      throw new InternalServerErrorException();
    } else {
      //this.logger.debug('response:', JSON.stringify(favs), 'status code: 200');
      return favs;
    }
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
    const favDBArr: IFav[] = await this.favDB.find();
    const favDB = favDBArr[0];
    if (!favDB[favGroups[group].field].includes(id))
      throw new NotFoundException();

    return this.favService.delete(favGroups[group].field, id);
  }
}
