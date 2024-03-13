import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { EventTypeService } from './eventType.service';

@Module({
  providers: [EventTypeService],
  imports: [SupabaseModule.injectClient()],
  exports: [EventTypeService],
})
export class EventTypeModule {}
