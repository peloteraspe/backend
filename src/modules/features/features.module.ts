import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { FeaturesService } from './features.service';

@Module({
  providers: [FeaturesService],
  imports: [SupabaseModule.injectClient()],
  exports: [FeaturesService],
})
export class FeaturesModule {}
