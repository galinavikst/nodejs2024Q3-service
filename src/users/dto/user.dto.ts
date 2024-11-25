import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty() // required -> 400 bad request if empty or undefined
  @IsString({ message: 'login sould be a string and unique' })
  login: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]{3,30}/, {
    message:
      'Password must be 3 to 30 characters long and contain only letters and numbers',
  })
  password: string;
}

export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  //@MinLength(3)
  oldPassword: string;

  @ApiProperty({
    pattern: '^[a-zA-Z0-9]{3,30}',
  })
  @IsNotEmpty()
  @IsString()
  //@MinLength(3)
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

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
