import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as jwt from 'jsonwebtoken';
import { FORBIDDEN_TOKEN_KEY, REFRESH_JWT_COOKIE_KEY } from 'src/constants';
import { User } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      signedCookies: Record<string, string>;
      user?: User;
    }>();
    const token = request.signedCookies?.[REFRESH_JWT_COOKIE_KEY];

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const exist = await this.redisService.client.exists(`${FORBIDDEN_TOKEN_KEY}:${token}`);
    if (exist) {
      throw new UnauthorizedException('Forbidden token');
    }

    try {
      const payload = jwt.verify(token, this.configService.JWT_REFRESH_SECRET) as { user: User };
      if (!payload.user) {
        throw new UnauthorizedException('Invalid token payload');
      }
      request.user = payload.user;
      return true;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
