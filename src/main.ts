import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_AUTH_KEY, SWAGGER_PATH } from './constants';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './filters/exception.filter';

if (process.env.DEBUG !== 'true') {
  console.log = () => {};
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser(configService.COOKIE_SECRET, {}));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Ox API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      SWAGGER_AUTH_KEY,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(configService.APP_PORT, () => {
    console.debug('Doc: ', `http://localhost:${configService.APP_PORT || 3000}${SWAGGER_PATH}`);
  });
}

void bootstrap();
