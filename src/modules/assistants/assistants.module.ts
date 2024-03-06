import { Module } from '@nestjs/common';
import { SupabaseModule } from 'nestjs-supabase-js';

import { AssistantsService } from './assistants.service';

@Module({
  providers: [AssistantsService],
  imports: [SupabaseModule.injectClient()],
  exports: [AssistantsService],
})
export class AssistantsModule {}
