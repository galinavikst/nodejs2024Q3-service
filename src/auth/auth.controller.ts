import {
  Controller,
  Post,
  Body,
  Logger,
  Req,
  HttpCode,
  ForbiddenException,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { Response, Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('singup')
  @ApiOperation({ summary: 'signup new account' })
  @ApiBody({ type: CreateUserDto })
  async singUp(@Body() userData: CreateUserDto, @Req() req: Request) {
    const { url } = req;
    this.logger.log(`Request: ${url}, with body ${JSON.stringify(userData)}`);
    const response = await this.authService.signUp(userData);
    if (response) return 'User created!';
    else return 'Invalid credentials.';
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

    const tokens = await this.authService.login(user);
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
    // const refreshToken = req.cookies['refreshToken'];
    const { refreshToken } = req.body;

    console.log('refreshToken', refreshToken);

    if (!refreshToken)
      throw new UnauthorizedException('refresh token not provided'); // 401

    const tokens = await this.authService.refresh(refreshToken, res);
    if (tokens) return tokens;
    else throw new ForbiddenException('refresh auth controller error');
  }
}
