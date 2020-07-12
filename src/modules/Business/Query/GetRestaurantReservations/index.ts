import { Restaurant } from '@entities/Restaurant.entity';
import { IGetRestaurantRecipesInput } from '@modules/Business/Query/Business.inputs';
import { ReservationsRestaurantBusinessResponse } from '@modules/Business/Query/Business.types';

export const getRestaurantReservations = async (
  data: IGetRestaurantRecipesInput,
): Promise<ReservationsRestaurantBusinessResponse> => {
  try {
    const identifier = data.restaurantIdentifier;
    const restaurant = await Restaurant.findOne({ restaurantIdentifier: identifier }, { relations: ['reservations'] });

    if (!restaurant) throw new Error('No restaurant was found');

    return {
      error: false,
      data: restaurant.reservations,
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
      message: 'Could not create Restaurant',
    };
  }
};
