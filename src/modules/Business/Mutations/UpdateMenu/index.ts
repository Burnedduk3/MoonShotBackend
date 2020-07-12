import { Recipes } from '@entities/Recipes.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { IUpdateMenu } from '@modules/Business/Mutations/Business.inputs';
import { GeneralRestaurantBusinessResponse } from '@modules/Business/Mutations/Business.types';
import { getConnection } from 'typeorm';

export const UpdateMenu = async (
  data: IUpdateMenu,
  restaurantId: string,
  action: string,
): Promise<GeneralRestaurantBusinessResponse> => {
  try {
    const rest = await Restaurant.findOne({
      where: { restaurantIdentifier: restaurantId },
      relations: ['recipes', 'owner'],
    });

    if (!rest) throw new Error('No restaurant was found');

    if (action === 'add') {
      const newRecipe = await Recipes.create({
        price: data.price,
        description: data.description,
        name: data.name,
        recipeCategory: data.recipeCategory,
      }).save();
      await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(rest).add(newRecipe);
      rest.recipes.push(newRecipe);
    }

    if (action === 'delete') {
      const deleteRecipe = await Recipes.findOne({ where: { recipeIdentifier: data.recipeIdentifier } });

      if (!deleteRecipe) throw new Error('Not recipe found');

      await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(rest).remove(deleteRecipe);
      await Recipes.remove(deleteRecipe);
      const indexToDelete = rest.recipes.findIndex((element: Recipes) => {
        if (element.recipeIdentifier === deleteRecipe.recipeIdentifier) {
          return true;
        }
        // istanbul ignore next
        return false;
      });
      if (indexToDelete !== -1) {
        rest.recipes.splice(indexToDelete, 1);
      }
    }
    return {
      error: false,
      data: rest,
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
      message: 'Could not update Menu',
    };
  }
};
