import { Restaurant } from '@entities/Restaurant.entity';
import { IGetRestaurantsInputs } from '@modules/user/Query/User.inputs';
import { getConnection } from 'typeorm';
import { IUserGetRestaurants } from '../User.types';

export const getRestaurants = async (data: IGetRestaurantsInputs): Promise<IUserGetRestaurants> => {
  try {
    const restaurantQuery = await getConnection().getRepository(Restaurant).createQueryBuilder('restaurant');

    if (data.address === '' && data.name === '') {
      restaurantQuery.where('restaurant.id > :minimum', { minimum: data.initialId });
    }

    if (data.address) {
      restaurantQuery.orWhere('restaurant.address LIKE :address', {
        address: data.address ? `%${data.address}%` : '',
      });
    }

    if (data.name) {
      restaurantQuery.orWhere('restaurant.name LIKE :name', { name: data.name ? `%${data.name}%` : '' });
    }

    const response = await restaurantQuery.limit(20).getMany();

    return {
      error: false,
      data: response,
    };
  } catch (e) {
    /* istanbul ignore next */
    return {
      error: true,
      message: (e as Error).message,
    };
  }
};
