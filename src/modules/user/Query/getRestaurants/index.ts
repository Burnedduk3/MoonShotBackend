import { Restaurant } from '@entities/Restaurant.entity';
import { IGetRestaurantsInputs } from '@modules/user/Query/User.inputs';
import { getConnection } from 'typeorm';
import { IUserGetRestaurants } from '../User.types';

export const getRestaurants = async (data: IGetRestaurantsInputs): Promise<IUserGetRestaurants> => {
  try {
    const restaurants = await getConnection()
      .getRepository(Restaurant)
      .createQueryBuilder('restaurant')
      .where('restaurant.id > :minimum', { minimum: data.initialId })
      .limit(20)
      .getMany();
    return {
      error: false,
      data: restaurants,
    };
  } catch (e) {
    return {
      error: true,
      message: (e as Error).message,
    };
  }
};
