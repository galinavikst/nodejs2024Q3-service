import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body, query } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `Method:${method} url:${originalUrl} body:${JSON.stringify(
          body,
        )} query:${JSON.stringify(
          query,
        )} status:${statusCode}, content-length:${contentLength} - ${userAgent} ${ip} \n\t`,
      );
    });

    next();
  }
}
