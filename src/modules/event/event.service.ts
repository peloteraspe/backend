import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { LevelService } from '../level/level.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class EventService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly profileService: ProfileService,
    private readonly levelService: LevelService,
  ) {}
  async getUsernameByEventId(eventId: number) {
    const { data, status } = await this.supabaseClient
      .from('event')
      .select('created_by_id')
      .eq('id', eventId)
      .single();

    if (status !== 200) throw new NotFoundException('Evento no encontrado');
    const userId = data?.created_by_id;

    const username = await this.profileService.getUsernameByUserId(userId);
    return username;
  }

  async getAllEvents() {
    const { data, status } = await this.supabaseClient
      .from('level')
      .select('*');

    if (status !== 200)
      throw new NotFoundException('No se encontraron eventos');
    //const levelId = data?.level;
    //const level = await this.levelService.getLevel(levelId);

    return data;
  }
}
