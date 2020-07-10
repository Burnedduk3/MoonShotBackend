import { Recipes } from '@entities/Recipes.entity';
import { updateRecipesHandler } from '@modules/admin/recipes/crud/UpdateRecipesHandler';
import { updateRecipesRelationsHandler } from '@modules/admin/recipes/crud/UpdateRecipesRelationsHandler';
import { Arg, FieldResolver, Resolver } from 'type-graphql';
import {
  AdminRecipesArrayCrudResponse,
  AdminRecipesCrudResponse,
  AdminRecipesCrudTypes,
} from './AdminRecipesCrud.types';
import {
  CrudCreateRecipesInputs,
  CrudRecipesUpdateInput,
  CrudRecipesUpdateRelationsInputs,
} from './CrudRecipes.inputs';

@Resolver(/* istanbul ignore next */() => AdminRecipesCrudTypes)
export class AdminRecipesCrudResolver {
  @FieldResolver(/* istanbul ignore next */ () => AdminRecipesCrudTypes) // without args
  async updateRecipes(
    @Arg('id') id: number,
    @Arg('data') data: CrudRecipesUpdateInput,
  ): Promise<AdminRecipesCrudResponse> {
    return await updateRecipesHandler(id, data);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminRecipesCrudTypes)
  async updateRecipesRelations(
    @Arg('id') id: number,
    @Arg('data') data: CrudRecipesUpdateRelationsInputs,
  ): Promise<AdminRecipesCrudResponse> {
    return await updateRecipesRelationsHandler(id, data);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminRecipesCrudTypes)
  async createRecipes(@Arg('data') data: CrudCreateRecipesInputs): Promise<AdminRecipesCrudResponse> {
    try {
      const recipe = await Recipes.create({
        ...data,
      }).save();

      /* istanbul ignore next */
      if (!recipe) throw new Error('Could not create recipe Role');

      return {
        error: false,
        data: recipe,
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
        message: 'Could Not Create recipe Role',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminRecipesCrudTypes)
  async deleteRecipes(@Arg('id') id: number): Promise<AdminRecipesCrudResponse> {
    try {
      const recipeToBeDeleted = await Recipes.findOne(id);
      if (!recipeToBeDeleted) throw new Error('Recipe not found');
      await Recipes.delete(id);
      return {
        error: false,
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
        message: 'Could Not delete recipe Role',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminRecipesCrudTypes)
  async getAllRecipes(): Promise<AdminRecipesArrayCrudResponse> {
    try {
      const recipes = await Recipes.find({ relations: ['restaurantMenu'] });

      /* istanbul ignore next */
      if (!recipes) throw new Error('No recipe Found');

      return {
        error: false,
        data: recipes,
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
        message: 'No recipe Role Found',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminRecipesCrudTypes)
  async findRecipesById(@Arg('id') id: number): Promise<AdminRecipesCrudResponse> {
    try {
      const recipe = await Recipes.findOne(id, { relations: ['restaurantMenu'] });

      if (!recipe) throw new Error('No recipe Found');

      return {
        error: false,
        data: recipe,
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
        message: 'No recipe Found',
      };
    }
  }
}
