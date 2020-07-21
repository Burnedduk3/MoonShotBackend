import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { RestaurantRecipesArrayBusinessResponse } from '@modules/Business/Mutations/Business.types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'update restaurant capacity response' })
export class ReservationsRestaurantBusinessResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [Reservation], { nullable: true })
  data?: Reservation[];
}

@ObjectType({ description: 'update restaurant capacity response' })
export class RestaurantBusinessResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => Restaurant, { nullable: true })
  data?: Restaurant;
}

@ObjectType({ description: 'Business Query Resolver' })
export class BusinessQueryTypes {
  @Field()
  getMyRestaurant: RestaurantBusinessResponse;

  @Field()
  getRestaurantRecipes: RestaurantRecipesArrayBusinessResponse;

  @Field()
  getRestaurantReservations: ReservationsRestaurantBusinessResponse;
}
