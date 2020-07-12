import { Recipes } from '@entities/Recipes.entity';
import { IUpdateRecipe } from '@modules/Business/Mutations/Business.inputs';
import { RestaurantRecipesBusinessResponse } from '@modules/Business/Mutations/Business.types';
import { getConnection } from 'typeorm';

export const UpdateRecipe = async (
  data: IUpdateRecipe,
  recipeId: string,
): Promise<RestaurantRecipesBusinessResponse> => {
  try {
    let recipe = await Recipes.findOne({
      where: { recipeIdentifier: recipeId },
    });

    if (!recipe) throw new Error('Recipe not Found');

    await getConnection()
      .createQueryBuilder()
      .update(Recipes)
      .set({ ...data })
      .where('id = :id', { id: recipe.id })
      .execute();

    recipe = await Recipes.findOne(recipe.id);

    return {
      error: false,
      data: recipe,
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
      message: 'Could not update Capacity',
    };
  }
};
