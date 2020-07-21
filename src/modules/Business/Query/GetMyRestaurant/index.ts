import { User } from '@entities/User.entity';
import { IGetRestaurant } from '@modules/Business/Query/Business.inputs';
import { RestaurantBusinessResponse } from '@modules/Business/Query/Business.types';

export const getRestaurant = async (data: IGetRestaurant): Promise<RestaurantBusinessResponse> => {
  try {
    const user = await User.findOne({ username: data.username }, { relations: ['restaurant'] });

    if (!user) throw new Error('No user Found');

    if (!user.restaurant) throw new Error('User does not have any restaurant at his name');

    return {
      error: false,
      data: user?.restaurant,
    };
  } catch (error) {
    // istanbul ignore next
    if (error instanceof Error) {
      /* istanbul ignore next */
      return {
        error: true,
        message: error.message,
      };
    }
    // istanbul ignore next
    return {
      error: true,
      message: 'Could not create Restaurant',
    };
  }
};
