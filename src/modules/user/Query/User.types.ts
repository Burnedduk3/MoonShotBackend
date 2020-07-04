import { Reservation } from '@entities/Reservation.entity';
import { User } from '@entities/User.entity';
import { Field, ObjectType } from 'type-graphql';
import {Restaurant} from "@entities/Restaurant.entity";

@ObjectType({ description: 'user/UpdateUser response' })
export class UpdateUserResponse {
  @Field()
  error: boolean;

  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType({ description: 'user reservation response' })
export class IUserReservationResponse {
  @Field()
  error: boolean;

  @Field({ nullable: true })
  data?: Reservation;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType({ description: 'user reservations response' })
export class IUserReservationArrayResponse {
  @Field()
  error: boolean;

  @Field(() => [Reservation],{ nullable: true })
  data?: Reservation[];

  @Field({ nullable: true })
  message?: string;
}

@ObjectType({ description: 'user restaurant response' })
export class IUserGetRestaurants {
  @Field()
  error: boolean;

  @Field(() => [Restaurant],{ nullable: true })
  data?: Restaurant[];

  @Field({ nullable: true })
  message?: string;
}

@ObjectType({ description: 'UserResovers' })
export class UserTypes {
  @Field({ nullable: true })
  me: User;

  @Field()
  updateUser: UpdateUserResponse;

  @Field()
  getAllReservation: IUserReservationArrayResponse;

  @Field()
  getReservationById: IUserReservationResponse;

  @Field()
  getRestaurants: IUserGetRestaurants;
}
