import { Restaurant } from '@entities/Restaurant.entity';
import { IUpdateRestaurantCapacity } from '@modules/Business/Mutations/Business.inputs';
import { GeneralRestaurantBusinessResponse } from '@modules/Business/Mutations/Business.types';
import { getConnection } from 'typeorm';

export const updateCapacity = async (
  data: IUpdateRestaurantCapacity,
  action: string,
): Promise<GeneralRestaurantBusinessResponse> => {
  try {
    const rest = await Restaurant.findOne({ where: { restaurantIdentifier: data.restaurantId } });

    if (!rest) throw new Error('Restaurant not Found');

    if (action === 'add') {
      if (rest.capacity + 1 <= rest.maxCapacity) {
        rest.locationCapacity += 1;
      } else {
        // istanbul ignore next
        throw new Error('Max capacity reached');
      }
    }

    if (action === 'substraction') {
      if (rest.locationCapacity - 1 >= 0) {
        rest.locationCapacity -= 1;
      } else {
        // istanbul ignore next
        throw new Error('Capacity can not be below 0');
      }
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
    // istanbul ignore next
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
    /* istanbul ignore next */
    return {
      error: true,
      message: 'Could not update Capacity',
    };
  }
};
