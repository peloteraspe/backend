import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseModule } from 'nestjs-supabase-js';

import { EnvConfiguration, JoiValidationSchema } from './config';
import { EventModule } from './modules/event/event.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    SupabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        supabaseUrl: configService.get('supabase.url') ?? '',
        supabaseKey: configService.get('supabase.key') ?? '',
      }),
    }),
    EventModule,
    ProfileModule,
  ],
})
export class AppModule {}
