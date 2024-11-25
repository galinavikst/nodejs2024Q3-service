import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  Req,
  Logger,
} from '@nestjs/common';
import { CombinedAuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './users/dto/user.dto';

@ApiTags('Auth')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private authService: AuthService) {}
}
