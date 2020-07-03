import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { IUpdateUserFavorites } from '@modules/user/Mutations/User.inputs';
import { UserUpdateFavoritesResponse} from '@modules/user/Mutations/user.types';
import { getConnection } from 'typeorm';

export const updateFavorites = async (
  data: IUpdateUserFavorites,
  action: string,
): Promise<UserUpdateFavoritesResponse> => {
  try {
    const connection = getConnection();
    const restaurant = await Restaurant.findOne({ where: { restaurantIdentifier: data.restauranId } });
    const user = await User.findOne({ where: { username: data.username }, relations: ['restaurants'] });

    if (!restaurant) throw new Error('Restaurant not Found');
    if (!user) throw new Error('User not Found');

    if (action === 'add') {
      await connection.createQueryBuilder().relation(User, 'restaurants').of(user).add(restaurant);
      user.restaurants.push(restaurant);
    }

    if (action === 'delete') {
      await connection.createQueryBuilder().relation(User, 'restaurants').of(user).remove(restaurant);
      const indexToDelete = user.restaurants.findIndex((element: Restaurant) => {
        if (element.restaurantIdentifier === restaurant.restaurantIdentifier) {
          return true;
        }
        return false;
      });
      if (indexToDelete !== -1) {
        user.restaurants.splice(indexToDelete, 1);
      }
    }

    return {
      error: false,
      data: user,
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
