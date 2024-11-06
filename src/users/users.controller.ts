import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { validate as isValidUuid } from 'uuid';
import { IUser } from 'src/interfaces';
import { UserService } from './users.service';
import { CreateUserDto, GetUserDto, UpdatePasswordDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';

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

    return users; // positive default statusCode 200
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Omit<IUser, 'password'>> {
    if (!isValidUuid(id))
      throw new HttpException('Invalid user id.', HttpStatus.BAD_REQUEST);

    const user = await this.userService.getUserById(id);
    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    return plainToClass(GetUserDto, user); // positive default statusCode 200
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<IUser> {
    return await this.userService.create(body); // positive default status code - 201 Created
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDto,
  ): Promise<IUser> {
    if (!isValidUuid(id))
      throw new HttpException('Invalid user id.', HttpStatus.BAD_REQUEST);

    const user = await this.userService.getUserById(id);
    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    if (body.oldPassword !== user.password)
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);

    return plainToClass(
      GetUserDto,
      this.userService.update(id, body.newPassword),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!isValidUuid(id))
      throw new HttpException('Invalid user id.', HttpStatus.BAD_REQUEST);

    const user = await this.userService.getUserById(id);
    if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    return plainToClass(GetUserDto, this.userService.delete(id));
  }
}
