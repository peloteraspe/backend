import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { EventFeaturesModule } from '../eventFeatures/eventFeatures.module';
import { ProfileModule } from '../profile/profile.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [SupabaseModule.injectClient(), ProfileModule, EventFeaturesModule],
})
export class EventModule {}
