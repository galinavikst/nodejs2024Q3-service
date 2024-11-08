import { Injectable } from '@nestjs/common';
import { IUser } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, GetUserDto } from './dto/user.dto';
import { UserRepo } from 'src/db';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private usersDB: UserRepo) {}

  async findAll(): Promise<IUser[]> {
    try {
      const users = Object.values(this.usersDB.findAll());
      return users.map((user) => plainToClass(GetUserDto, user));
    } catch (error) {
      console.log('findAll servise', error);
    }
  }

  async create(user: CreateUserDto): Promise<IUser> {
    try {
      const id = uuidv4();
      const newUser = {
        ...user,
        id,
        version: 1,
        createdAt: Date.now(), // timestamp number
        updatedAt: Date.now(),
      };
      this.usersDB.save(newUser);

      return plainToClass(GetUserDto, newUser);
    } catch (error) {
      console.log('create servise', error);
    }
  }

  async getUserById(id: string) {
    try {
      return this.usersDB.getById(id);
    } catch (error) {
      console.log('getUserById servise', error);
    }
  }

  async update(id: string, newPassword: string) {
    try {
      const user = this.usersDB.getById(id);
      const updatedUser = {
        ...user,
        password: newPassword,
        version: user.version + 1,
        updatedAt: Date.now(),
      };

      return this.usersDB.update(updatedUser);
    } catch (error) {
      console.log('update servise', error);
    }
  }

  async delete(id: string) {
    try {
      return await this.usersDB.delete(id);
    } catch (error) {
      console.log('delete servise', error);
    }
  }
}
