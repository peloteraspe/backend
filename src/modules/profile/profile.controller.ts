import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UpdateProfile } from './dto/profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  @ApiOperation({ description: 'Devuelve el profile de la jugadora' })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
    example: 1,
    description: 'ID del perfil',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado por id',
  })
  @ApiResponse({
    status: 404,
    description: 'El perfil no fue encontrado',
  })
  getProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.getProfileById(id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Actualiza el profile de la jugadora' })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
    example: 24,
    description: 'ID del perfil',
  })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente!' })
  @ApiBadRequestResponse({ description: 'Error al actualizar el perfil' })
  @ApiBody({
    type: UpdateProfile,
    examples: {
      example1: {
        value: {
          username: 'nombreEjemplo',
          level_id: 3,
          player_position: [1, 3, 5],
        },
        description:
          '*Las propiedades son opcionales, no es necesario enviar todas pero si una al menos. *El level_id debe ser entre 1 y 3. *player_position debe ser un array de id entre 1 y 5',
      },
    },
  })
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateData: UpdateProfile,
  ) {
    return this.profileService.updateProfileById(id, updateData);
  }
}
