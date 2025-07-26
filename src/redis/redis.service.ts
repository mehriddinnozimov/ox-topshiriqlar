import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client: Redis;

  constructor(configService: ConfigService) {
    this.client = new Redis({
      host: configService.REDIS_HOST,
      port: configService.REDIS_PORT,
      password: configService.REDIS_PASSWORD,
    });

    this.client.on('connect', () => {
      console.log('[Redis] Connected');
    });

    this.client.on('error', (err: Error) => {
      console.error(err);
    });
  }
  async onModuleDestroy() {
    await this.client.quit(err => {
      console.error(err);
    });
  }
}
