import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
//import { UserRepo } from 'src/db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
