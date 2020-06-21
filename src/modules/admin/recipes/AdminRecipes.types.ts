import { AdminRecipesCrudTypes } from '@modules/admin/recipes/crud/AdminRecipesCrud.types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'User Types' })
export class AdminRecipesTypes {
  @Field()
  crud: AdminRecipesCrudTypes;
}
