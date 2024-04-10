import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { ProfilePositionModule } from '../profilePosition/profilePosition.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [SupabaseModule.injectClient(), ProfilePositionModule],
  exports: [ProfileService],
})
export class ProfileModule {}
