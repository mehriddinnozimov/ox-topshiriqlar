import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LoginDTO, VerifyDTO } from './auth,dto';
import { randomBytes, randomInt } from 'crypto';
import {
  ACCESS_JWT_TTL,
  MAX_OTP_INTEGER,
  MIN_OTP_INTEGER,
  OTP_KEY,
  OTP_LENGTH,
  OTP_TTL_IN_SECONDS,
  OTS_LENGTH,
  REFRESH_JWT_TTL,
} from 'src/constants';
import { promisify } from 'src/utils/common';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from 'src/config/config.service';
import jwt from 'jsonwebtoken';

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

  async verify(prismaService: PrismaTransaction, payload: VerifyDTO) {
    const userId = await this.redisService.client.get(`${OTP_KEY}:${payload.ots}:${payload.otp}`);
    if (!userId) {
      throw new BadRequestException('Code is not valid');
    }

    const user = await prismaService.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const accessToken = jwt.sign(user, this.configService.JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_JWT_TTL,
    });
    const refreshToken = jwt.sign(user, this.configService.JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_JWT_TTL,
    });

    return {
      success: true,
      accessToken,
      refreshToken,
    };
  }
}
