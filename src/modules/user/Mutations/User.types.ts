import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'update restaurant capacity response' })
export class UserReservationResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => Reservation, { nullable: true })
  data?: Reservation;
}

@ObjectType({ description: 'update restaurant capacity response' })
export class UpdateRestaurantUserResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => Restaurant, { nullable: true })
  data?: Restaurant;
}

@ObjectType({ description: 'Business Resolver' })
export class UserMutationTypes {
  @Field({ nullable: true })
  makeReservation: UserReservationResponse;

  @Field({ nullable: true })
  deleteReservation: UpdateRestaurantUserResponse;
}
