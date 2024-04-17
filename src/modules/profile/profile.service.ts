import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { ProfilePositionService } from '../profilePosition/profilePosition.service';
import { createProfileDTO, UpdateProfile } from './dto/profile.dto';
@Injectable()
export class ProfileService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly profilePositionService: ProfilePositionService,
  ) {}
  async getByUserId(userId: string) {
    const { data } = await this.supabaseClient
      .from('profile')
      .select()
      .eq('user', userId)
      .single();

    if (!data) throw new NotFoundException('No se encontró el user');

    return data;
  }
  async getProfileByUserId(userId: string) {
    const { id } = await this.getByUserId(userId);

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

  async updateProfileById(userId: string, updateData: UpdateProfile) {
    try {
      const { id } = await this.getByUserId(userId);
      const { player_position, level_id, username } = updateData;
      const { data: profile } = await this.supabaseClient
        .from('profile')
        .update({
          username,
          level_id,
        })
        .eq('id', id)
        .select();

      if (!profile) {
        throw new NotFoundException('No se encontró el perfil');
      }

      if (player_position) {
        const uniquePositions = [...new Set(player_position)];
        await this.profilePositionService.deleteProfilePositionById(id);
        await this.profilePositionService.insertProfilePositionById(
          id,
          uniquePositions,
        );
      }

      return { message: 'Perfil actualizado exitosamente!' };
    } catch (error) {
      throw new BadRequestException((error as any).response);
    }
  }

  async deleteProfileById(id: number) {
    const { error: profileDeleteError } = await this.supabaseClient
      .from('profile')
      .delete()
      .eq('id', id);
    if (profileDeleteError) {
      throw new BadRequestException(
        `Error al eliminar el perfil:${profileDeleteError.message}`,
      );
    }
  }

  async createProfile(createProfile: createProfileDTO) {
    const { player_position, level_id, username, user } = createProfile;
    const { data: player, error: errorCreatePlayer } = await this.supabaseClient
      .from('profile')
      .insert({
        user,
        username,
        level_id,
      })
      .select();
    try {
      if (errorCreatePlayer) {
        throw new BadRequestException(
          `Error al crear la jugadora: ${errorCreatePlayer.message}`,
        );
      }
      if (player) {
        const uniquePositions = [...new Set(player_position)];
        await this.profilePositionService.insertProfilePositionById(
          player[0].id,
          uniquePositions,
        );
        return { message: 'Perfil creado exitosamente!' };
      }
    } catch (error) {
      if (player) await this.deleteProfileById(player[0].id);
      throw new BadRequestException((error as any)?.response);
    }
  }
}
