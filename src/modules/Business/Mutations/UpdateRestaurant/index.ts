import { Restaurant } from '@entities/Restaurant.entity';
import { IUpdateRestaurant } from '@modules/Business/Mutations/Business.inputs';
import { GeneralRestaurantBusinessResponse } from '@modules/Business/Mutations/Business.types';
import { getConnection } from 'typeorm';

export const UpdateRestaurantInfo = async (
  data: IUpdateRestaurant,
  restaurantId: string,
): Promise<GeneralRestaurantBusinessResponse> => {
  try {
    let rest = await Restaurant.findOne({
      where: { restaurantIdentifier: restaurantId },
      relations: ['recipes', 'owner'],
    });

    if (!rest) throw new Error('Restaurant not Found');

    await getConnection()
      .createQueryBuilder()
      .update(Restaurant)
      .set({ ...data })
      .where('id = :id', { id: rest.id })
      .execute();

    rest = await Restaurant.findOne(rest.id);

    return {
      error: false,
      data: rest,
    };
  } catch (error) {
    // istanbul ignore next
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
    // istanbul ignore next
    return {
      error: true,
      message: 'Could not update Capacity',
    };
  }
};
