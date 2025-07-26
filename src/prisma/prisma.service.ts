import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(configService: ConfigService) {
    const log: (Prisma.LogLevel | Prisma.LogDefinition)[] = ['error', 'info', 'warn'];

    if (configService.DEBUG) {
      log.push('query');
    }
    super({
      log,
      transactionOptions: {
        isolationLevel: 'ReadCommitted',
        timeout: 60_000_000,
        maxWait: 120_000_000,
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
