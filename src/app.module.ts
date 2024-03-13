import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseModule } from 'nestjs-supabase-js';

import { EnvConfiguration, JoiValidationSchema } from './config';
import { AssistantsModule } from './modules/assistants/assistants.module';
import { EventModule } from './modules/event/event.module';
import { EventFeaturesModule } from './modules/eventFeatures/eventFeatures.module';
import { EventTypeModule } from './modules/eventType/eventType.module';
import { FeaturesModule } from './modules/features/features.module';
import { LevelModule } from './modules/level/level.module';
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
    LevelModule,
    EventTypeModule,
    EventFeaturesModule,
    FeaturesModule,
    AssistantsModule,
  ],
})
export class AppModule {}
