import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { EventFeaturesService } from './eventFeatures.service';

@Module({
  providers: [EventFeaturesService],
  imports: [SupabaseModule.injectClient()],
  exports: [EventFeaturesService],
})
export class EventFeaturesModule {}
