import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class EventTypeService {
  constructor(private readonly supabaseClient: SupabaseClient) {}
  async getNameByEventTypeId(eventTypeId: string) {
    const { data } = await this.supabaseClient
      .from('eventType')
      .select('name')
      .eq('id', eventTypeId)
      .single();

    if (!data) throw new NotFoundException('No se encontró el tipo de evento');

    return data?.name;
  }
}
