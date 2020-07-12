import { Recipes } from '@entities/Recipes.entity';
import { AdminRecipesCrudResponse } from '@modules/admin/recipes/crud/AdminRecipesCrud.types';
import { CrudRecipesUpdateInput } from '@modules/admin/recipes/crud/CrudRecipes.inputs';
import { getConnection } from 'typeorm';

export const updateRecipesHandler = async (
  id: number,
  data: CrudRecipesUpdateInput,
): Promise<AdminRecipesCrudResponse> => {
  try {
    await getConnection()
      .createQueryBuilder()
      .update(Recipes)
      .set({ ...data })
      .where('id = :id', { id })
      .execute();

    const restaurant = await Recipes.findOne(id);

    if (!restaurant) throw new Error('Recipes not found');

    return {
      error: false,
      data: restaurant,
    };
  } catch (e) {
    /* istanbul ignore next */
    if (e instanceof Error) {
      return {
        error: true,
        message: e.message,
      };
    }
    /* istanbul ignore next */
    return {
      error: true,
      message: 'Error updateRecipeHandler',
    };
  }
};
