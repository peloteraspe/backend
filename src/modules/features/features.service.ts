import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class FeaturesService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async getFeaturesByIds(featureIds: number[]) {
    const featuresData = await Promise.all(
      featureIds.map(async (id) => {
        const { data } = await this.supabaseClient
          .from('features')
          .select('name')
          .eq('id', id.toString());

        if (!data)
          throw new NotFoundException(
            `No se encontró el servicio de evento con ID ${id}`,
          );

        return data[0];
      }),
    );

    return featuresData;
  }
}
