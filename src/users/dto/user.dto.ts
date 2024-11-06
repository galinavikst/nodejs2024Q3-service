import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() // required -> 400 bad request if empty or undefined
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  password: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  newPassword: string;
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
