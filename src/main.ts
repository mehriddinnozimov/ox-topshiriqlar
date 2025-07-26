import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';
import { OxService } from './ox/ox.service';
import { Company } from '@prisma/client';

if (process.env.DEBUG !== 'true') {
  console.log = () => {};
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const oxService = app.get(OxService);
  await oxService.getProfile({
    subdomain: 'demo',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTE3ODM5MjMsImV4cCI6MTc1MjgyMDcyMywicm9sZXMiOlt7fV0sImlkIjoxMjY0MDJ9.MR_DnZP8dpLSVt_frkmCfq6GFiLRIFsUF9xn7PxQxOxCzrJL_mn2oSTh2GMmocXdQk_HpCnOK3nhBj38GP3Xg4ZAJmdGCsMD2OCiJAPgeXSp8mxYpUHFXNoc-9TB9jhNZQNafsHR3EyZlTGDhrvdV-wY60PQZDPIRxGXtwUx3V3rPexNbiqAeSHdmBRo9aJ9tjkKa0vaI-qXSpyafemCUcauo9T3bswdKU_lw8vbrfPaeKhKOAUG-sZLnQ0lMusxT4v5c-oTKuJx7VwQuaFvaXbMDprxf2QtPloHYc2A1IEhF6EUmeydvFbwM2vzD9uZTfQwG8cCrwTqJlALeYgIdRcX92O8_s3o1QDW7aOfLupMGoRXZ2ktBiqdAMCmqtizSns-W_XOqiCvd_evaJrOtKodM2JOchArFl5A6vPFRi01zYBOutq8fzQIBn8e5yjkmZgJfrxtx-K56YhQZCHk7Kw1YEYFpPZLmZbmBLloB2ke1qxuOofMJr84Td4_f41UjsSAh9yZW1ZcnIywsHeF5lYsRyNQHguUMjUxqtNGajtE8j9TGBlxRA8dZuC-LgaxjrrijDxEQrwqV5nd5l8IsK-qIG3KQEZT2krHFl4_gxjdHG3IyuNqVsF-FYTxLDve1JwNidQjDYbCZN5XLrSTWf-O-9FxkyRgE-npMqi2lz8',
  } as Company);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(configService.APP_PORT);
}

void bootstrap();
