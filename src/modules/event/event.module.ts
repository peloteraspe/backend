import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { ProfileModule } from '../profile/profile.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [SupabaseModule.injectClient(), ProfileModule],
})
export class EventModule {}
