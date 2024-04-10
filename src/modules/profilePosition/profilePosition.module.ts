import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { ProfilePositionService } from './profilePosition.service';

@Module({
  providers: [ProfilePositionService],
  imports: [SupabaseModule.injectClient()],
  exports: [ProfilePositionService],
})
export class ProfilePositionModule {}
