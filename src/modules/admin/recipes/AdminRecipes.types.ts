import { AdminRecipesCrudTypes } from '@modules/admin/recipes/crud/AdminRecipesCrud.types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'UserTypes Types' })
export class AdminRecipesTypes {
  @Field()
  crud: AdminRecipesCrudTypes;
}
