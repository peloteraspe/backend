import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { UpdateProfile } from './dto/profile.dto';
@Injectable()
export class ProfileService {
  constructor(private readonly supabaseClient: SupabaseClient) {}
  async getUsernameByUserId(userId: string) {
    const { data } = await this.supabaseClient
      .from('profile')
      .select('username')
      .eq('user', userId)
      .single();

    if (!data) throw new NotFoundException('No se encontró el user');

    return data;
  }
  async getProfileById(id: number) {
    const { data, error } = await this.supabaseClient
      .from('profile')
      .select(
        'id, username, user, level_id(*), profile_position(player_position:player_position(*))',
      )
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException('Error al obtener el perfil:', error.message);
    }

    const formatedData = {
      id: data.id,
      username: data.username,
      user: data.user,
      level: (data?.level_id as any)?.name,
      player_position: data?.profile_position.map((e: any) => {
        return {
          id: e.player_position.id,
          name: e.player_position.name,
        };
      }),
    };
    return formatedData;
  }

  async updateProfileById(id: number, updateData: UpdateProfile) {
    try {
      if (Object.keys(updateData).length === 0) {
        throw new BadRequestException(
          'Debes ingresar las propiedades a modificar',
        );
      }

      const { error: profileUpdateError } = await this.supabaseClient
        .from('profile')
        .update({
          username: updateData?.username,
          level_id: updateData?.level_id,
        })
        .eq('id', id);

      if (profileUpdateError) {
        throw new BadRequestException(
          'Error al actualizar el perfil:',
          profileUpdateError.message,
        );
      }

      if (updateData.player_position) {
        const { error: positionsDeleteError } = await this.supabaseClient
          .from('profile_position')
          .delete()
          .eq('profile_id', id);

        if (positionsDeleteError) {
          throw new BadRequestException(
            'Error al actualizar las posiciones del perfil:',
            positionsDeleteError.message,
          );
        }

        await Promise.all(
          updateData.player_position.map(async (positionId) => {
            const { error: positionsUpdateError } = await this.supabaseClient
              .from('profile_position')
              .insert([{ profile_id: id, position_id: positionId }]);

            if (positionsUpdateError) {
              throw new BadRequestException(
                'Error al actualizar las posiciones del perfil:',
                positionsUpdateError.message,
              );
            }
          }),
        );
      }
      return { message: 'Perfil actualizado exitosamente!' };
    } catch (error) {
      throw new BadRequestException(`Error al actualizar el perfil: ${error}`);
    }
  }
}
