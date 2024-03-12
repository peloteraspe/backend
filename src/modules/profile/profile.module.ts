import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [SupabaseModule.injectClient()],
  exports: [ProfileService],
})
export class ProfileModule {}
