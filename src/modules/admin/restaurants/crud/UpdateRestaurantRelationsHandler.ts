import { Recipes } from '@entities/Recipes.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { AdminRestaurantCrudResponse } from '@modules/admin/restaurants/crud/AdminRestaurantCrud.types';
import { CrudRestaurantUpdateRelationsInputs } from '@modules/admin/restaurants/crud/CrudRestaurant.inputs';
import { getConnection } from 'typeorm';

export const updateRestaurantRelationsHandler = async (
  id: number,
  data: CrudRestaurantUpdateRelationsInputs,
  action: string,
): Promise<AdminRestaurantCrudResponse> => {
  try {
    const restaurant = await Restaurant.findOne(id, {
      relations: ['owner', 'recipes'],
    });

    if (!restaurant) throw new Error('Restaurant not found');

    if (action === 'add') {
      if (data.recipeId) {
        const recipe = await Recipes.findOne(data.recipeId);
        if (!recipe) throw new Error('recipe not Found');
        await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(restaurant).add(recipe);
        restaurant.recipes.push(recipe);
      }
    }

    if (action === 'delete') {
      if (data.recipeId) {
        const recipe = await Recipes.findOne(data.recipeId);
        if (!recipe) throw new Error('recipe not Found');
        await getConnection().createQueryBuilder().relation(Restaurant, 'restaurants').of(restaurant).remove(recipe);
        const indexToDelete = restaurant.recipes.indexOf(recipe);
        restaurant.recipes.splice(indexToDelete, 1);
      }
    }

    if (data.ownerId) {
      const user = await User.findOne(data.ownerId);
      if (!user) throw new Error('No user was found');
      await getConnection().createQueryBuilder().relation(Restaurant, 'owner').of(restaurant).set(user);
      restaurant.owner = user;
    }

    return {
      error: false,
      data: restaurant,
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: true,
        message: e.message,
      };
    }
    /* istanbul ignore next */
    return {
      error: true,
      message: 'Error updateReservationRelationHandler',
    };
  }
};
