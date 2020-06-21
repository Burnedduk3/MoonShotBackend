import { Recipes } from '@entities/Recipes.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { AdminRecipesCrudResponse } from '@modules/admin/recipes/crud/AdminRecipesCrud.types';
import { CrudRecipesUpdateRelationsInputs } from '@modules/admin/recipes/crud/CrudRecipes.inputs';
import { getConnection } from 'typeorm';

export const updateRecipesRelationsHandler = async (
  id: number,
  data: CrudRecipesUpdateRelationsInputs,
  _action: string,
): Promise<AdminRecipesCrudResponse> => {
  try {
    const recipe = await Recipes.findOne(id, {
      relations: ['restaurantMenu'],
    });

    if (!recipe) throw new Error('Recipes not found');

    if (data.restaurantId) {
      const restaurant = await Restaurant.findOne(data.restaurantId);
      if (!restaurant) throw new Error('restaurant not Found');
      await getConnection().createQueryBuilder().relation(Recipes, 'restaurantMenu').of(recipe).set(restaurant);
      recipe.restaurantMenu = restaurant;
    }

    return {
      error: false,
      data: recipe,
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
      message: 'Error updateRecipesRelationsHandler',
    };
  }
};
