import { Field, InputType } from 'type-graphql';

@InputType()
export class CrudRecipesUpdateInput {
  @Field({ nullable: false })
  name?: string;

  @Field({ nullable: false })
  price?: number;

  @Field({ nullable: false })
  description?: string;

  @Field({ nullable: false })
  recipeCategory?: string;
}

@InputType()
export class CrudRecipesUpdateRelationsInputs {
  @Field({ nullable: true })
  restaurantId?: number;
}

@InputType()
export class CrudCreateRecipesInputs {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  price: number;

  @Field({ nullable: false })
  description: string;

  @Field({ nullable: false })
  recipeCategory: string;
}
