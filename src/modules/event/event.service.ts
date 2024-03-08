import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { AssistantsService } from '../assistants/assistants.service';
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
    private readonly assistantsService: AssistantsService,
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
    const { data: relationData, status: relationDataStatus } =
      await this.supabaseClient.from('event').select('id, level, EventType');
    const { data: eventData } = await this.supabaseClient
      .from('event')
      .select('title, start_time, end_time, location, location_text, price');

    if (relationDataStatus !== 200 || !relationData || !eventData)
      throw new NotFoundException('No se encontraron eventos');

    const eventsWithData = await Promise.all(
      relationData.map(async (event, index) => {
        const levelId = event.level;
        const Nivel = await this.levelService.getLevelNameById(levelId);

        const eventTypeid = event.EventType;
        const TipoDeEvento =
          await this.eventTypeService.getNameByEventTypeId(eventTypeid);

        const eventFeatureid = event.id;
        const Servicios =
          await this.eventFeatureService.getEventFeatureById(eventFeatureid);

        const assistantsid = event.id;
        const Assistants =
          await this.assistantsService.getAssistantsById(assistantsid);
        const Participantes =
          await this.profileService.getUsernameByUserId(Assistants);

        return {
          ...eventData[index],
          Nivel,
          TipoDeEvento,
          Servicios,
          Participantes,
        };
      }),
    );

    return eventsWithData;
  }
}
