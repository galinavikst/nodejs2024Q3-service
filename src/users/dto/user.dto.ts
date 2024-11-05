import { Exclude } from 'class-transformer';

export class CreateUserDto {
  login: string;
  password: string;
}

export class GetUserDto {
  id: string; // uuid v4
  login: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number;

  @Exclude()
  password: string;
}
