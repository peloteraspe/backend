import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class FeaturesService {
  constructor(private readonly supabaseClient: SupabaseClient) {}
  async getFeaturesById(featuresId: string) {
    const { data } = await this.supabaseClient
      .from('features')
      .select('name')
      .eq('id', featuresId);

    if (!data)
      throw new NotFoundException('No se encontró el servicio de evento');

    return data;
  }
}
