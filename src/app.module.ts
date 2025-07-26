import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';
import { OxModule } from './ox/ox.module';

@Module({
  imports: [PrismaModule, ConfigModule, RedisModule, OxModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
