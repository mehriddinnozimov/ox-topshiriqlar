import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';
import { OxModule } from './ox/ox.module';
import { APP_GUARD } from '@nestjs/core/constants';
import { AuthGuard } from './guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [PrismaModule, ConfigModule, RedisModule, OxModule, AuthModule, CompanyModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
