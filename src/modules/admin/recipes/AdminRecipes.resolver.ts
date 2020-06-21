import { FieldResolver, Resolver } from 'type-graphql';
import { AdminRecipesTypes } from './AdminRecipes.types';

@Resolver(() => AdminRecipesTypes)
export class AdminRecipesResolver {
  @FieldResolver()
  crud(): AdminRecipesTypes {
    return new AdminRecipesTypes();
  }
}
