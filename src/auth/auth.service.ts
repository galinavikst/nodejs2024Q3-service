import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ITokens, IUser } from 'src/interfaces';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.model';
import { UserService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

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
    login: string, // or id
    pass: string,
  ): Promise<Omit<IUser, 'password'> | null> {
    try {
      const user = await this.usersDB.findOneBy({ login });
      if (!user) throw new NotFoundException(); // 404

      const match = await bcrypt.compare(pass, user.password);
      if (!match) throw new UnauthorizedException(); // 401

      const { password, ...result } = user; // remove pass from response
      return result;
    } catch (error) {
      throw new UnauthorizedException('Credentials is not valid');
    }
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
      const payload = { login: user.login, userId: user.id };

      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);

      return {
        accessToken,
        refreshToken,
        userId: user.id,
      };
    } catch (error) {
      this.logger.error('authService login', error);
    }
  }

  async validateToken(token: string) {
    if (!token) throw new UnauthorizedException('token not valid');
    return this.jwtService.verify(token);
  }

  async refresh(token: string, res: Response): Promise<ITokens> {
    try {
      const decodedRefreshToken = await this.validateToken(token);
      if (!decodedRefreshToken)
        throw new ForbiddenException('Invalid or expired refresh token');

      // user information from the refresh token payload
      const { userId, login } = decodedRefreshToken;
      const payload = { login, userId };

      const newAccessToken = await this.generateAccessToken(payload);
      const newRefreshToken = await this.generateRefreshToken(payload);

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true, // Prevent access via JavaScript
        secure: false, // if true - it's sent only over HTTPS in production
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        userId,
      } as ITokens;
    } catch (error) {
      throw new ForbiddenException('Error refreshing tokens');
    }
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
