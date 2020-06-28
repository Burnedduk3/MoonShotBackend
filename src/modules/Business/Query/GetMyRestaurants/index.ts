import { User } from '@entities/User.entity';
import { GeneralRestaurantArrayBusinessResponse } from '@modules/Business/Mutations/Business.types';
import { IGetMyRestaurantInput } from '@modules/Business/Query/Business.inputs';

export const getMyRestaurants = async (
  data: IGetMyRestaurantInput,
): Promise<GeneralRestaurantArrayBusinessResponse> => {
  try {
    const username = data.userOwner;
    const user = await User.findOne({ username }, { relations: ['role', 'restaurants'] });

    if (!user) throw new Error('No user was found to create Restaurant');

    return {
      error: false,
      data: user.restaurants,
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
      message: 'Could not create Restaurant',
    };
  }
};
