import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { EventFeaturesService } from '../eventFeatures/eventFeatures.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class EventService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly profileService: ProfileService,
    private readonly eventFeaturesService: EventFeaturesService,
  ) {}
  async getUsernameByEventId(eventId: number) {
    const { data, status } = await this.supabaseClient
      .from('event')
      .select('created_by_id')
      .eq('id', eventId)
      .single();

    if (status !== 200) throw new NotFoundException('Evento no encontrado');
    const userId = data?.created_by_id;

    const { username } = await this.profileService.getByUserId(userId);

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
    const eventIds = data.map((event) => event.id);
    const featuresData =
      await this.eventFeaturesService.getEventFeatures(eventIds);

    const eventsData = data.map((event) => {
      const {
        start_time: startTime,
        end_time: endTime,
        location_text: locationText,
        level,
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
        featuresData,
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

  async getEventsByUserId(userId: string) {
    const { data, status } = await this.supabaseClient
      .from('event')
      .select(
        'id,title, start_time, end_time, location, location_text, price, level ( name ), EventType (name), assistants (state)',
      )
      .eq('created_by_id', userId);

    if (status !== 200 || !data)
      throw new NotFoundException('No se encontraron eventos');

    const eventIds = data.map((event) => event.id);
    const featuresData =
      await this.eventFeaturesService.getEventFeatures(eventIds);

    const eventsData = data.map((event) => {
      const {
        location_text: locationText,
        level,
        EventType: eventType,
        ...rest
      } = event;

      const formattedDateTime: string = this.formattedDateTime(
        event.start_time,
        event.end_time,
      );

      return {
        level,
        eventType,
        formattedDateTime,
        locationText,
        featuresData,
        ...rest,
      };
    });
    const currentDate = new Date();

    const pastEvents = [];
    const upcomingEvents = [];

    for (const event of eventsData) {
      const eventWithoutTimes = Object.assign({}, event);
      delete eventWithoutTimes.end_time;
      delete eventWithoutTimes.start_time;
      const eventStartTime = new Date(event.start_time);

      if (eventStartTime < currentDate) {
        pastEvents.push(eventWithoutTimes);
      } else {
        upcomingEvents.push(eventWithoutTimes);
      }
    }

    return { upcomingEvents, pastEvents };
  }
}
