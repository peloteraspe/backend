import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EventService } from './event.service';

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('user/:eventId')
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

  @Get()
  @ApiOperation({ description: 'Obtiene todos los eventos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los eventos',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron eventos',
  })
  getEvents() {
    return this.eventService.getAllEvents();
  }

  @Get(':id')
  @ApiOperation({ description: 'Obtiene un event por id' })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
    example: 1,
    description: 'ID del evento',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del evento',
  })
  @ApiResponse({
    status: 404,
    description: 'No se el evento',
  })
  getEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getEventById(id);
  }

  @Get('up-past/:userId')
  @ApiOperation({ description: 'Devuelve el username del event Id' })
  @ApiParam({
    name: 'userId',
    type: 'string',
    required: true,
    example: '4596174f-4d72-4cf3-b99e-ddb38e2ff093',
    description: 'ID del usuario',
  })
  @ApiOperation({ description: 'Obtiene todos los eventos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los eventos',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron eventos',
  })
  getEventsByUserId(@Param('userId') userId: string) {
    return this.eventService.getEventsByUserId(userId);
  }
}
