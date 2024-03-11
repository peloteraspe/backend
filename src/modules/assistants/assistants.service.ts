import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AssistantsService {
  constructor(private readonly supabaseClient: SupabaseClient) {}
  async getAssistantsByEventId(eventId: string) {
    const { data } = await this.supabaseClient
      .from('assistants')
      .select('user')
      .eq('event', eventId);

    if (!data)
      throw new NotFoundException('No se encontró el servicio de evento');

    const users = data.map(({ user }) => user);
    return users;
  }
}
