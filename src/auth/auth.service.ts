import {
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ITokens, IUser } from 'src/interfaces';
import { CreateUserDto, GetUserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.model';
import { UserService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private usersDB: Repository<User>,
  ) {}

  async validateUser(
    login: string,
    pass: string,
  ): Promise<Omit<IUser, 'password'> | null> {
    const user = await this.usersDB.findOneBy({ login });
    console.log('user', user);

    if (user) {
      const match = await bcrypt.compare(pass, user.password);
      console.log('match', match);

      if (match) {
        const { password, ...result } = user; // remove pass from response
        return result;
      } else return null;
    }

    return null;
  }

  async signUp(createUserData: CreateUserDto): Promise<IUser> {
    try {
      return await this.usersService.create(createUserData);
    } catch (error) {
      this.logger.error('authService signup', error);
    }
  }

  async login(user: Omit<IUser, 'password'>): Promise<ITokens> {
    try {
      const payload = { login: user.login, sub: user.id };

      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        userId: user.id,
      };
    } catch (error) {
      this.logger.error('authService login', error);
    }
  }

  async refresh(token: string): Promise<string> {
    return 'string';

    //return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: Record<string, any>): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRE_TIME'), // Example: '15m'
    });
  }

  async generateRefreshToken(payload: Record<string, any>): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRE_TIME'), // Example: '7d'
    });
  }
}
