import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class EventFeaturesService {
  constructor(private readonly supabaseClient: SupabaseClient) {}
  async getEventFeatures(eventIds: string[]) {
    const { data } = await this.supabaseClient
      .from('eventFeatures')
      .select('feature (name)')
      .eq('event', eventIds);

    if (!data)
      throw new NotFoundException('No se encontró el servicio de evento');

    return data;
  }
}
