import { Recipes } from '@entities/Recipes.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Admin Recipes CRUD types response' })
export class AdminRecipesCrudResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => Recipes, { nullable: true })
  data?: Recipes;
}

@ObjectType({ description: 'admin Recipes CRUD types response' })
export class AdminRecipesArrayCrudResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [Recipes], { nullable: true })
  data?: Recipes[];
}

@ObjectType({ description: 'admin Recipes CRUD types' })
export class AdminRecipesCrudTypes {
  @Field(() => AdminRecipesCrudResponse, { nullable: true })
  updateRecipes: AdminRecipesCrudResponse;

  @Field(() => AdminRecipesCrudResponse, { nullable: true })
  updateRecipesRelations: AdminRecipesCrudResponse;

  @Field(() => AdminRecipesCrudResponse, { nullable: true })
  createRecipes: AdminRecipesCrudResponse;

  @Field(() => AdminRecipesCrudResponse, { nullable: true })
  deleteRecipes: AdminRecipesCrudResponse;

  @Field(() => AdminRecipesArrayCrudResponse, { nullable: true })
  getAllRecipes: AdminRecipesArrayCrudResponse;

  @Field(() => AdminRecipesCrudResponse, { nullable: true })
  findRecipesById: AdminRecipesCrudResponse;
}
