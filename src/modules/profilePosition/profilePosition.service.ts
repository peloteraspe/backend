import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ProfilePositionService {
  constructor(private readonly supabaseClient: SupabaseClient) {}
  async deleteProfilePositionById(id: number) {
    const { error: positionsDeleteError } = await this.supabaseClient
      .from('profile_position')
      .delete()
      .eq('profile_id', id);

    if (positionsDeleteError) {
      throw new BadRequestException(
        `Error al eliminar las posiciones del perfil:${positionsDeleteError.message}`,
      );
    }
  }

  async insertProfilePositionById(id: number, player_position: number[]) {
    const { error: positionsUpdateError } = await this.supabaseClient
      .from('profile_position')
      .insert(
        player_position.map((position) => ({
          profile_id: id,
          position_id: position,
        })),
      );
    if (positionsUpdateError) {
      throw new BadRequestException(
        `Error al crear o actualizar las posiciones del perfil: ${positionsUpdateError.message}`,
      );
    }
  }
}
