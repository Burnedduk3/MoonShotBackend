import { Restaurant } from '@entities/Restaurant.entity';
import { IUpdateRestaurantUserCapacity } from '@modules/user/Mutations/User.inputs';
import { UpdateRestaurantUserResponse } from '@modules/user/Mutations/user.types';
import { getConnection } from 'typeorm';

export const bookUpdate = async (
  data: IUpdateRestaurantUserCapacity,
  action: string,
): Promise<UpdateRestaurantUserResponse> => {
  try {
    const rest = await Restaurant.findOne({ where: { restaurantIdentifier: data.restauranId } });

    if (!rest) throw new Error('Restaurant not Found');

    if (action === 'add') {
      if ((rest.capacity + data.bookSize) <= rest.maxCapacity) {
        rest.capacity += data.bookSize;
      } else {
        throw new Error('Max capacity reached');
      }
    }

    if (action === 'substraction') {
      if ((rest.capacity - 1) >= 0) {
        rest.capacity -= data.bookSize;
      } else {
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
