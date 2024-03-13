import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { LevelService } from './level.service';

@Module({
  providers: [LevelService],
  imports: [SupabaseModule.injectClient()],
  exports: [LevelService],
})
export class LevelModule {}
