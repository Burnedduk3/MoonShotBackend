import { Restaurant } from '@entities/Restaurant.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'update restaurant capacity response' })
export class GeneralQueryRestaurantArrayBusinessResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [Restaurant], { nullable: true })
  data?: Restaurant[];
}

@ObjectType({ description: 'Business Query Resolver' })
export class BusinessQueryTypes {
  @Field()
  getMyRestaurants: GeneralQueryRestaurantArrayBusinessResponse;
}
