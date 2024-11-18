import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { IUser } from 'src/interfaces';
import { UserService } from './users.service';
import { CreateUserDto, GetUserDto, UpdatePasswordDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  @Header('Content-Type', 'application/json; charset=utf-8') // by default
  @ApiOperation({ summary: 'Get all users' })
  async findAll(): Promise<Omit<IUser, 'password'>[]> {
    const users = await this.userService.findAll();
    if (!users) throw new InternalServerErrorException();

    return users; // positive default statusCode 200
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  async getUserById(
    @Param('id', new ParseUUIDPipe()) id: string, // 400
  ): Promise<Omit<IUser, 'password'>> {
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException();

    return plainToClass(GetUserDto, user); // positive default statusCode 200
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() body: CreateUserDto): Promise<IUser> {
    return await this.userService.create(body); // positive default status code - 201 Created
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string, // 400
    @Body() body: UpdatePasswordDto,
  ): Promise<IUser> {
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException();

    if (body.oldPassword !== user.password)
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);

    return plainToClass(
      GetUserDto,
      this.userService.update(id, body.newPassword),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(204) // by default 204 if the record is found and deleted
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException();

    return plainToClass(GetUserDto, this.userService.delete(id));
  }
}
