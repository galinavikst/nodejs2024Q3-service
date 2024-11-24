import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // with expired JWT, the request will be denied and a 401 Unauthorized
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    this.logger.log(request);

    const authHeader = request.headers['Authorization'];
    const token = this.extractTokenFromHeader(request);
    this.logger.log('Extracted Token:', token);

    // checks if the Authorization header exists
    if (!authHeader || !token) {
      throw new UnauthorizedException(
        'Authorization header is missing or token is invalid',
      ); // 401
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
      this.logger.log('Verified Payload:', payload);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('verify');
    }
    return true;
  }

  async validate(payload: { login: string; userId: string }) {
    this.logger.log('strategy validate payload:', payload);

    // Validate and return user payload (attaches user to request automatically)
    if (!payload || !payload.login || !payload.userId) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return { userId: payload.userId, login: payload.login };
  }

  // Checks if the token follows Bearer scheme
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
