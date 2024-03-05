import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { EventFeaturesService } from '../eventFeatures/eventFeatures.service';
import { EventTypeService } from '../eventType/eventType.service';
import { LevelService } from '../level/level.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class EventService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly profileService: ProfileService,
    private readonly levelService: LevelService,
    private readonly eventTypeService: EventTypeService,
    private readonly eventFeatureService: EventFeaturesService,
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
      .from('event')
      .select(
        'id, level, EventType, start_time, end_time, location_text, price',
      );

    if (status !== 200 || !data)
      throw new NotFoundException('No se encontraron eventos');

    const eventsWithData = await Promise.all(
      data.map(async (event) => {
        const levelId = event.level;
        const Nivel = await this.levelService.getLevelNameById(levelId);

        const eventTypeid = event.EventType;
        const Tipo =
          await this.eventTypeService.getNameByEventTypeId(eventTypeid);

        const eventFeatureid = event.id;
        const Servicio =
          await this.eventFeatureService.getFeatureById(eventFeatureid);

        return { ...event, Nivel, Tipo, Servicio };
      }),
    );

    return eventsWithData;
  }
}
