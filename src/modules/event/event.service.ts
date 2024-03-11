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
    const { data, status } = await this.supabaseClient
      .from('event')
      .select(
        'id, level, EventType,title, start_time, end_time, location, location_text, price',
      );

    if (status !== 200 || !data)
      throw new NotFoundException('No se encontraron eventos');

    const eventsData = await Promise.all(
      data.map(async (event) => {
        const title = event.title;
        const startTime = event.start_time;
        const endTime = event.end_time;

        function formatDate(dateString: string): string {
          const days = [
            'Domingo',
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado',
          ];
          const date = new Date(dateString);
          const dayOfWeek = days[date.getDay()];
          const formattedDate = date.toISOString().split('T')[0];
          return `${dayOfWeek} | ${formattedDate}`;
        }

        function formatTime(timeString: string): string {
          return (
            timeString.split('T')[1].split(':')[0] +
            ':' +
            timeString.split('T')[1].split(':')[1]
          );
        }

        const formattedDateTime: string =
          formatDate(startTime) +
          ' | ' +
          formatTime(startTime) +
          ' - ' +
          formatTime(endTime);

        const location = event.location;
        const locationText = event.location_text;
        const price = event.price;
        const levelId = event.level;
        const level = await this.levelService.getLevelNameById(levelId);

        const eventTypeid = event.EventType;
        const eventType =
          await this.eventTypeService.getNameByEventTypeId(eventTypeid);

        const eventFeatureid = event.id;
        const services =
          await this.eventFeatureService.getEventFeatureById(eventFeatureid);

        const assistantsid = event.id;
        const assistantsIds =
          await this.assistantsService.getAssistantsById(assistantsid);
        const assistants =
          await this.profileService.getUsernameByUserId(assistantsIds);

        return {
          level,
          title,
          eventType,
          formattedDateTime,
          location,
          locationText,
          services,
          price,
          assistants,
        };
      }),
    );

    return eventsData;
  }
}
