import { Restaurant } from '@entities/Restaurant.entity';
import { IUpdateRestaurantCapacity } from '@modules/Business/Mutations/Business.inputs';
import { UpdateRestaurantCrudResponse } from '@modules/Business/Mutations/Business.types';
import { getConnection } from 'typeorm';

export const updateCapacity = async (
  data: IUpdateRestaurantCapacity,
  action: string,
): Promise<UpdateRestaurantCrudResponse> => {
  try {
    const rest = await Restaurant.findOne({ where: { restaurantIdentifier: data.restauranId } });

    if (!rest) throw new Error('Restaurant not Found');

    if (action === 'add') {
      rest.capacity += 1;
    }

    if (action === 'substraction') {
      rest.capacity -= 1;
    }

    await getConnection()
      .createQueryBuilder()
      .update(Restaurant)
      .set(rest)
      .where('id = :id', { id: rest.id })
      .execute();

    return {
      error: false,
      data: rest,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
    return {
      error: true,
      message: 'Could not update Capacity',
    };
  }
};
