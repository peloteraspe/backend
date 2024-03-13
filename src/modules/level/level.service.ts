import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class LevelService {
  constructor(private readonly supabaseClient: SupabaseClient) {}
  async getLevelNameById(levelId: string) {
    const { data } = await this.supabaseClient
      .from('level')
      .select('name')
      .eq('id', levelId)
      .single();

    if (!data) throw new NotFoundException('No se encontró el nivel');

    return data?.name;
  }
}
