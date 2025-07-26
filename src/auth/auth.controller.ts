import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { LoginDTO, VerifyDTO } from './auth.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { REFRESH_JWT_COOKIE_KEY, REFRESH_JWT_TTL_IN_MS, SWAGGER_AUTH_KEY } from 'src/constants';
import { AuthRefreshGuard } from 'src/guards/auth-refresh.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  @Post('/login')
  @Public()
  login(@Body() payload: LoginDTO) {
    return this.authService.login(this.prismaService, payload);
  }

  @Post('/verify')
  @Public()
  async verify(@Res({ passthrough: true }) res: Response, @Body() payload: VerifyDTO) {
    const tokens = await this.authService.verify(this.prismaService, payload);

    res.cookie(REFRESH_JWT_COOKIE_KEY, tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: REFRESH_JWT_TTL_IN_MS,
      signed: true,
    });

    return {
      success: true,
      access_token: tokens.access_token,
    };
  }

  @Get('/profile')
  @ApiBearerAuth(SWAGGER_AUTH_KEY)
  profile(@GetUser() user: User) {
    return this.authService.profile(this.prismaService, user.id);
  }

  @Get('/refresh')
  @Public()
  @UseGuards(AuthRefreshGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: User,
  ) {
    const tokens = this.authService.createTokens(user);

    res.cookie(REFRESH_JWT_COOKIE_KEY, tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: REFRESH_JWT_TTL_IN_MS,
      signed: true,
    });

    const accessToken = req.headers.authorization?.split(' ')[1] as string;
    const refreshToken = req.signedCookies?.[REFRESH_JWT_COOKIE_KEY] as string;

    await this.authService.addTokensToBlackList(accessToken, refreshToken);

    return {
      success: true,
      access_token: tokens.access_token,
    };
  }

  @Get('/logout')
  @ApiBearerAuth(SWAGGER_AUTH_KEY)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accessToken = req.headers.authorization?.split(' ')[1] as string;
    const refreshToken = req.signedCookies?.[REFRESH_JWT_COOKIE_KEY] as string;
    res.clearCookie(REFRESH_JWT_COOKIE_KEY);

    await this.authService.addTokensToBlackList(accessToken, refreshToken);
    return {
      success: true,
    };
  }
}
