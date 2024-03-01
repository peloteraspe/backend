import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EventService } from './event.service';

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':eventId')
  @ApiOperation({ description: 'Devuelve el username del event Id' })
  @ApiParam({
    name: 'eventId',
    type: 'number',
    required: true,
    example: 1,
    description: 'ID del evento',
  })
  @ApiResponse({
    status: 200,
    description: 'Username encontrado por el event id',
  })
  @ApiResponse({
    status: 404,
    description: 'El evento no encontrado',
  })
  getUsernameByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventService.getUsernameByEventId(eventId);
  }
}
