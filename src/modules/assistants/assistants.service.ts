import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AssistantsService {
  constructor(private readonly supabaseClient: SupabaseClient) {}
  async getAssistantsById(AssistantsId: string) {
    const { data } = await this.supabaseClient
      .from('assistants')
      .select('user')
      .eq('event', AssistantsId);

    if (!data)
      throw new NotFoundException('No se encontró el servicio de evento');
    return data[0].user;
  }
}
