import { Injectable, Logger } from '@nestjs/common';
import { IUser } from 'src/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, GetUserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

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
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(user.password, saltRounds);

      const newUser = this.usersDB.create({
        ...user,
        id,
        password: passwordHash,
        version: 1,
        createdAt: Date.now(), // timestamp number
        updatedAt: Date.now(),
      }); // same user = new User(newUser)
      const response = await this.usersDB.save(newUser);

      return plainToClass(GetUserDto, response);
    } catch (error) {
      this.logger.error('create servise', error);
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
