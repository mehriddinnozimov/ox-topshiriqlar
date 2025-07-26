import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LoginDTO, VerifyDTO } from './auth.dto';
import { randomBytes, randomInt } from 'crypto';
import {
  ACCESS_JWT_TTL,
  ACCESS_JWT_TTL_IN_MS,
  FORBIDDEN_TOKEN_KEY,
  MAX_OTP_INTEGER,
  MIN_OTP_INTEGER,
  OTP_KEY,
  OTP_LENGTH,
  OTP_TTL_IN_SECONDS,
  OTS_LENGTH,
  REFRESH_JWT_TTL,
  REFRESH_JWT_TTL_IN_MS,
} from 'src/constants';
import { promisify } from 'src/utils/common';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from 'src/config/config.service';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}
  async login(prismaService: PrismaTransaction, payload: LoginDTO) {
    const user = await prismaService.user.upsert({
      where: {
        email: payload.email,
      },
      create: {
        email: payload.email,
      },
      update: {},
    });

    const [errorRandomInt, otpInt] = await promisify(randomInt, MIN_OTP_INTEGER, MAX_OTP_INTEGER);
    if (errorRandomInt) {
      throw new InternalServerErrorException(errorRandomInt);
    }

    const [errorRandomBytes, otsB] = await promisify(randomBytes, OTS_LENGTH);
    if (errorRandomBytes) {
      throw new InternalServerErrorException(errorRandomBytes);
    }

    const otp = `${otpInt}`.padStart(OTP_LENGTH, '0');
    const ots = otsB.toString('hex');

    await this.redisService.client.set(
      `${OTP_KEY}:${ots}:${otp}`,
      user.id,
      'EX',
      OTP_TTL_IN_SECONDS,
    );

    return {
      success: true,
      ots,
      otp: this.configService.NODE_ENV === 'production' ? undefined : otp,
    };
  }

  createTokens(user: User) {
    console.log({ user });
    const accessToken = jwt.sign({ user }, this.configService.JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_JWT_TTL,
    });
    const refreshToken = jwt.sign({ user }, this.configService.JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_JWT_TTL,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async verify(prismaService: PrismaTransaction, payload: VerifyDTO) {
    const userId = await this.redisService.client.get(`${OTP_KEY}:${payload.ots}:${payload.otp}`);
    if (!userId) {
      throw new BadRequestException('Code is not valid');
    }

    await this.redisService.client.del(`${OTP_KEY}:${payload.ots}:${payload.otp}`);

    const user = await prismaService.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.createTokens(user);
  }

  async profile(prismaService: PrismaTransaction, userId: number) {
    return prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        companies: {
          include: {
            company: {
              select: {
                subdomain: true,
              },
            },
          },
        },
      },
    });
  }

  async addTokensToBlackList(accessToken: string, refreshToken: string) {
    if (accessToken) {
      await this.redisService.client.set(
        `${FORBIDDEN_TOKEN_KEY}:${accessToken}`,
        '1',
        'EX',
        ACCESS_JWT_TTL_IN_MS / 1000,
      );
    }

    if (refreshToken) {
      await this.redisService.client.set(
        `${FORBIDDEN_TOKEN_KEY}:${refreshToken}`,
        '1',
        'EX',
        REFRESH_JWT_TTL_IN_MS / 1000,
      );
    }
    return true;
  }
}
