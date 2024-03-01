import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { ProfileService } from './profile.service';

@Module({
  providers: [ProfileService],
  imports: [SupabaseModule.injectClient()],
  exports: [ProfileService],
})
export class ProfileModule {}
