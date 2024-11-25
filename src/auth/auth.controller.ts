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
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
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
  async login(
    @Body() userData: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      userData.login,
      userData.password,
    );
    if (!user) throw new ForbiddenException('no user login controller'); // 403

    const tokens = await this.authService.login(user, res);
    if (tokens) {
      // Set HTTP-only cookies for tokens
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true, // available only on server
        secure: false,
      });
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true, // available only on server
        secure: false,
      });
      return tokens;
    } else throw new ForbiddenException('login auth controller error'); // 403
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    //const { refreshToken } = req.body;
    if (!refreshToken)
      throw new UnauthorizedException('refresh token not provided'); // 401

    console.log(req.cookies, refreshToken);

    const tokens = await this.authService.refresh(refreshToken);

    if (tokens) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true, // Prevent access via JavaScript
        secure: false, // if true - it's sent only over HTTPS in production
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
      });
      return tokens;
    } else throw new ForbiddenException('refresh auth controller error');
  }

  // @Post('auth/logout')
  // async logout(@Request() req) {
  //   return req.logout();
  // }
}
