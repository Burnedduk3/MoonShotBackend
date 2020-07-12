import { Restaurant } from '@entities/Restaurant.entity';
import { RestaurantRecipesArrayBusinessResponse } from '@modules/Business/Mutations/Business.types';
import { IGetRestaurantRecipesInput } from '@modules/Business/Query/Business.inputs';

export const getRestaurantRecipes = async (
  data: IGetRestaurantRecipesInput,
): Promise<RestaurantRecipesArrayBusinessResponse> => {
  try {
    const identifier = data.restaurantIdentifier;
    const restaurant = await Restaurant.findOne({ restaurantIdentifier: identifier }, { relations: ['recipes'] });

    if (!restaurant) throw new Error('No user was found to create Restaurant');

    return {
      error: false,
      data: restaurant.recipes,
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
