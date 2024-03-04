import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { LevelModule } from '../level/level.module';
import { ProfileModule } from '../profile/profile.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [SupabaseModule.injectClient(), ProfileModule, LevelModule],
})
export class EventModule {}
