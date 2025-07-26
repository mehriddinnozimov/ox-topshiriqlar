import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { ConfigModule } from '../config/config.module';
import { AuthGuard } from '../guards/auth.guard';
import { AuthController } from './auth.controller';

@Module({
  imports: [PrismaModule, RedisModule, ConfigModule],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
