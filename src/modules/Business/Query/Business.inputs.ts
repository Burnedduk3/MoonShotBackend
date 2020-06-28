import { Field, InputType } from 'type-graphql';

@InputType()
export class IGetMyRestaurantInput {
  @Field()
  userOwner: string;
}

@InputType()
export class IGetRestaurantRecipesInput {
  @Field()
  restaurantIdentifier: string;
}
