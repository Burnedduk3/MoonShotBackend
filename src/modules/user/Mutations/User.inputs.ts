import { Field, InputType } from 'type-graphql';

@InputType()
export class IUpdateRestaurantUserCapacity {
  @Field({ nullable: true })
  restauranId: string;

  @Field({ nullable: true })
  bookSize: number;
}
