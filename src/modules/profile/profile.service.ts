import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ProfileService {
  constructor(private readonly supabaseClient: SupabaseClient) {}
  async getUsernameByUserId(userId: string) {
    const { data } = await this.supabaseClient
      .from('profile')
      .select('username')
      .eq('user', userId)
      .single();

    if (!data) throw new NotFoundException('No se encontró el user');

    return data?.username;
  }
}
