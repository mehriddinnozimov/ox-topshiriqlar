import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';
import { FORBIDDEN_TOKEN_KEY } from 'src/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string>; user?: User }>();
    const authHeader = request.headers?.authorization;
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const token = authHeader.split(' ')[1];

    const exist = await this.redisService.client.exists(`${FORBIDDEN_TOKEN_KEY}:${token}`);
    if (exist) {
      throw new UnauthorizedException('Forbidden token');
    }

    try {
      const payload = jwt.verify(token, this.configService.JWT_ACCESS_SECRET) as { user: User };
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
