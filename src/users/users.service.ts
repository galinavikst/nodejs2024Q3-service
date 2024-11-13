import { Injectable } from '@nestjs/common';
import { IUser } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, GetUserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersDB: Repository<User>,
  ) {}

  async findAll(): Promise<IUser[]> {
    try {
      const users = await this.usersDB.find();
      return users.map((user) => plainToClass(GetUserDto, user));
    } catch (error) {
      console.log('findAll servise', error);
    }
  }

  async create(user: CreateUserDto): Promise<IUser> {
    try {
      const id = uuidv4();
      const newUser = this.usersDB.create({
        ...user,
        id,
        version: 1,
        createdAt: Date.now(), // timestamp number
        updatedAt: Date.now(),
      }); // same user = new User(newUser)
      const response = await this.usersDB.save(newUser);

      return plainToClass(GetUserDto, response);
    } catch (error) {
      console.log('create servise', error);
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.usersDB.findOneBy({ id });

      return user;
    } catch (error) {
      console.log('getUserById servise', error);
    }
  }

  async update(id: string, newPassword: string) {
    try {
      const user = await this.usersDB.findOneBy({ id });
      const updatedUser = {
        ...user,
        password: newPassword,
        version: user.version + 1,
        updatedAt: Date.now() as number,
      };

      return await this.usersDB.save(updatedUser);
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
