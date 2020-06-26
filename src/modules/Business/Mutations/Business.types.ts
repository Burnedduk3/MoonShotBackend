import { Restaurant } from '@entities/Restaurant.entity';
import { Field, ObjectType } from 'type-graphql';
import {Recipes} from "@entities/Recipes.entity";

@ObjectType({ description: 'update restaurant capacity response' })
export class GeneralRestaurantBusinessResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => Restaurant, { nullable: true })
  data?: Restaurant;
}

@ObjectType({ description: 'update restaurant capacity response' })
export class GeneralRestaurantArrayBusinessResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [Restaurant], { nullable: true })
  data?: Restaurant[];
}

@ObjectType({ description: 'update restaurant capacity response' })
export class RestaurantRecipesArrayBusinessResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [Recipes], { nullable: true })
  data?: Recipes[];
}

@ObjectType({ description: 'update restaurant capacity response' })
export class RestaurantRecipesBusinessResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => Recipes, { nullable: true })
  data?: Recipes;
}


@ObjectType({ description: 'Business Resolver' })
export class BusinessTypes {
  @Field({ nullable: true })
  updateCapacity: GeneralRestaurantBusinessResponse;

  @Field({ nullable: true })
  createRestaurant: GeneralRestaurantBusinessResponse;

  @Field()
  updateRestaurantInfo: GeneralRestaurantBusinessResponse;

  @Field()
  updateMenu: GeneralRestaurantBusinessResponse;

  @Field()
  updateRecipe: RestaurantRecipesBusinessResponse;
}
