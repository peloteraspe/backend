import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* ======= LOAD CONFIG .ENV.* ======= */
  const config: ConfigService = app.get(ConfigService);

  await app.listen(config.get('api.port') ?? 3005, '0.0.0.0');
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
