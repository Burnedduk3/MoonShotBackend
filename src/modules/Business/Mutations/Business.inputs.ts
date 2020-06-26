import { Field, InputType } from 'type-graphql';

@InputType()
export class IUpdateRestaurantCapacity {
  @Field({ nullable: true })
  restauranId: string;
}
