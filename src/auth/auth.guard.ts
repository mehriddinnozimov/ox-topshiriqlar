import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import jwt, { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string>; user?: any }>();
    const authHeader = request.headers?.authorization;
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, this.configService.JWT_ACCESS_SECRET) as JwtPayload;
      if (!payload || typeof payload !== 'object' || !('id' in payload)) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
