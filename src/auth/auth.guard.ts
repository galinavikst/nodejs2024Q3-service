import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// export class CombinedAuthGuard extends AuthGuard('jwt') {}
export class CombinedAuthGuard extends AuthGuard(['local', 'jwt']) {}
