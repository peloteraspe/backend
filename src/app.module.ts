import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvConfiguration, JoiValidationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
  ],
})
export class AppModule {}
