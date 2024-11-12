import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { UserRepo } from 'src/db';

@Module({
  controllers: [UsersController],
  providers: [UserRepo, UserService],
  exports: [],
})
export class UsersModule {}
