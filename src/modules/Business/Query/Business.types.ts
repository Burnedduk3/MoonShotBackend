import { Restaurant } from '@entities/Restaurant.entity';
import { RestaurantRecipesArrayBusinessResponse } from '@modules/Business/Mutations/Business.types';
import { Field, ObjectType } from 'type-graphql';
import {Reservation} from "@entities/Reservation.entity";

@ObjectType({ description: 'update restaurant capacity response' })
export class GeneralQueryRestaurantArrayBusinessResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [Restaurant], { nullable: true })
  data?: Restaurant[];
}

@ObjectType({ description: 'update restaurant capacity response' })
export class ReservationsRestaurantBusinessResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [Reservation], { nullable: true })
  data?: Reservation[];
}

@ObjectType({ description: 'Business Query Resolver' })
export class BusinessQueryTypes {
  @Field()
  getMyRestaurants: GeneralQueryRestaurantArrayBusinessResponse;

  @Field()
  getRestaurantRecipes: RestaurantRecipesArrayBusinessResponse;

  @Field()
  getRestaurantReservations: ReservationsRestaurantBusinessResponse;
}
