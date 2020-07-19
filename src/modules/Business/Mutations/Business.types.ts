import { Recipes } from '@entities/Recipes.entity';
import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { Field, ObjectType } from 'type-graphql';

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

@ObjectType({ description: 'Add Companion Response' })
export class AddCompanionResponse {
  @Field()
  error: boolean;

  @Field({ nullable: true })
  reservation?: Reservation;

  @Field({ nullable: true })
  message?: string;
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

  @Field()
  addCompanion: AddCompanionResponse;
}
