import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies['accessToken'];
      const refreshToken = req.cookies['refreshToken'];

      if (!accessToken || !refreshToken) {
        res.status(401).send({ error: 'Authentication tokens are missing' });
        return;
      }

      try {
        await this.authService.validateToken(accessToken);
        req.headers['authorization'] = `Bearer ${accessToken}`;
      } catch (error) {
        const newTokens = await this.authService.refresh(refreshToken, res);
        req.headers['authorization'] = `Bearer ${newTokens.accessToken}`;
        req.body = newTokens;
      }

      console.log('Header set:', req.headers['authorization']);
    } catch (error) {
      throw new Error(error); // 500
    }

    // next middleware in the pipeline
    next();
  }
}
