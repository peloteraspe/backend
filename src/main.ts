import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  /* ======= LOAD CONFIG .ENV.* ======= */
  const config: ConfigService = app.get(ConfigService);

  /* ======= SET PREFIX END_POINT ======= */
  app.setGlobalPrefix('api/v1');

  /* ======= ENABLE CORS ======= */
  app.enableCors();

  /* ======= INIT DOC SWAGGER ======= */
  if (process.env.NODE_ENV !== 'production') {
    initSwagger(app);
  }

  await app.listen(config.get('api.port') ?? 3005, '0.0.0.0');
  logger.log(`🚀 Application is running on: ${await app.getUrl()}`);

  /* ======= DOCS GENERATE ======= */
  if (process.env.NODE_ENV !== 'production') {
    logger.debug(
      `Swagger document generated ${await app.getUrl()}/api/v1/docs`,
      'Swagger',
    );
  }
}
void bootstrap();
