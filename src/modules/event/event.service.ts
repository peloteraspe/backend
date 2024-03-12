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
        'id,title, start_time, end_time, location, location_text, price, max_users, level ( name ), EventType (name), assistants (user)',
      );

    if (status !== 200 || !data)
      throw new NotFoundException('No se encontraron eventos');

    const eventsData = await Promise.all(
      data.map(async (event) => {
        const {
          id: eventId,
          start_time: startTime,
          end_time: endTime,
          location_text: locationText,
          level: level,
          EventType: eventType,
          assistants,
          max_users,
          ...rest
        } = event;

        const formattedDateTime: string = this.formattedDateTime(
          startTime,
          endTime,
        );

        //const level = await this.levelService.getLevelNameById(levelId);

        // const eventType =
        // await this.eventTypeService.getNameByEventTypeId(eventTypeid);

        const services =
          await this.eventFeatureService.getEventFeatureByEventId(eventId);

        //const assistantsIds =
        //await this.assistantsService.getAssistantsByEventId(eventId);

        const placesLeft = max_users - assistants.length;

        return {
          level,
          eventType,
          formattedDateTime,
          locationText,
          services,
          placesLeft,
          ...rest,
        };
      }),
    );

    return eventsData;
  }

  private formattedDateTime(startTime: string, endTime: string): string {
    const data =
      this.formatDate(startTime) +
      ' | ' +
      this.formatTime(startTime) +
      ' - ' +
      this.formatTime(endTime);

    return data;
  }

  private formatDate(dateString: string): string {
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

  private formatTime(timeString: string): string {
    return (
      timeString.split('T')[1].split(':')[0] +
      ':' +
      timeString.split('T')[1].split(':')[1]
    );
  }
}
