import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  constructor(
    //private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies['accessToken'];
      const refreshToken = req.cookies['refreshToken'];

      if (!accessToken || !refreshToken) {
        console.error('Tokens are missing');
        res.status(401).send({ error: 'Authentication tokens are missing' });
        return;
      }

      const isValidAccessToken = await this.authService.validateToken(
        accessToken,
      );

      if (!isValidAccessToken) {
        const newTokens = await this.authService.refresh(refreshToken);

        req.headers['authorization'] = `Bearer ${newTokens.accessToken}`;
      } else {
        req.headers['authorization'] = `Bearer ${accessToken}`;
      }

      console.log('Header set:', req.headers['authorization']);
    } catch (error) {
      throw new Error(error); // 500
    }

    // next middleware in the pipeline
    next();
  }
}
