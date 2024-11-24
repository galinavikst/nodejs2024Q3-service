import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  Logger,
  Req,
  UseGuards,
  HttpCode,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { CombinedAuthGuard } from './auth.guard';
import { ITokens, IUser } from 'src/interfaces';
import { Response, Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('singup')
  @ApiOperation({ summary: 'signup new account' })
  @ApiBody({ type: CreateUserDto })
  async singUp(@Body() userData: CreateUserDto, @Req() req: Request) {
    const { url } = req;
    this.logger.log(`Request: ${url}, with body ${JSON.stringify(userData)}`);
    const response = await this.authService.signUp(userData);
    if (response) return 'User created!';
    else return 'Invalid credentials.';
    // в базе данных нет юзера с логином
    // TEST_AUTH_LOGIN, а также в том, что ендпойнт signup
    // возвращает не только пару токенов, но и id пользователя
  }

  @Post('login')
  @HttpCode(200) // success
  async login(@Body() userData: CreateUserDto, @Res() res: Response) {
    //this.logger.log(`Response:`, res.header('Authorization'));

    const user = await this.authService.validateUser(
      userData.login,
      userData.password,
    );
    if (!user) throw new ForbiddenException(); // 403

    const tokens = await this.authService.login(user);
    if (tokens) {
      res.set('Authorization', `Bearer ${tokens.access_token}`);

      console.log('Response Headers:', res.getHeader('Authorization'));

      return tokens;
    } else throw new ForbiddenException(); // 403
  }

  // @Post('refresh')
  // @HttpCode(200)
  // async refresh(@Body() body: { refreshToken: string }) {
  //   if (!body.refreshToken) throw new UnauthorizedException(); // 401

  //   const payload = this.jwtService.verify(body.refreshToken);
  //   if (!payload || !payload.userId) {
  //     throw new ForbiddenException('Refresh token is invalid or expired'); // 403
  //   }

  //   return await this.login()
  // }

  // @Post('auth/logout')
  // async logout(@Request() req) {
  //   return req.logout();
  // }
}
