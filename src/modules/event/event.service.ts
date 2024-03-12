import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { ProfileService } from '../profile/profile.service';

@Injectable()
export class EventService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly profileService: ProfileService,
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
    const { data: eventData, status: statusEvent } = await this.supabaseClient
      .from('event')
      .select(
        'id,title, start_time, end_time, location, location_text, price, max_users, level ( name ), EventType (name), assistants (user)',
      );

    if (statusEvent !== 200 || !eventData)
      throw new NotFoundException('No se encontraron eventos');

    const { data: featuresData, status: statusFeatures } =
      await this.supabaseClient
        .from('eventFeatures')
        .select('features: feature (name)')
        .eq(
          'event',
          eventData.map((event) => event.id),
        );

    if (statusFeatures !== 200 || !featuresData)
      throw new NotFoundException('No se encontraron servicios');

    const featureNames = featuresData?.map((item) => item.features);

    const eventsData = eventData.map((event) => {
      const {
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

      const placesLeft = max_users - assistants.length;
      return {
        level,
        eventType,
        formattedDateTime,
        locationText,
        featureNames,
        placesLeft,
        ...rest,
      };
    });

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
