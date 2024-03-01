import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [SupabaseModule.injectClient()],
})
export class EventModule {}
