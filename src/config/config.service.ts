import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ConfigService implements OnModuleInit {
  public readonly NODE_ENV = process.env.NODE_ENV as string;
  public readonly APP_PORT = Number(process.env.APP_PORT);
  public readonly JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
  public readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
  public readonly DEBUG = process.env.DEBUG === 'true';
  public readonly TZ = process.env.TZ;
  public readonly REDIS_HOST = process.env.REDIS_HOST as string;
  public readonly REDIS_PORT = Number(process.env.REDIS_PORT);
  public readonly REDIS_PASSWORD = process.env.REDIS_PASSWORD as string;
  public readonly OX_DOMAIN = process.env.OX_DOMAIN as string;

  public readonly COOKIE_SECRET = process.env.COOKIE_SECRET as string;

  onModuleInit() {}
}
