import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  HttpCode,
} from '@nestjs/common';
import { validate as isValidUuid } from 'uuid';
import { IUser } from 'src/interfaces';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('user')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<Omit<IUser, 'password'>[]> {
    const users = await this.userService.findAll();
    if (!users)
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Omit<IUser, 'password'>> {
    const user = await this.userService.getUserById(id);

    if (!isValidUuid(id))
      throw new HttpException('Invalid user id.', HttpStatus.BAD_REQUEST);

    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    if (Object.keys(user).length === 0) {
      return; // Implicitly return 204 No Content
    }

    return user;
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<IUser> {
    return await this.userService.create(body);
  }
}
