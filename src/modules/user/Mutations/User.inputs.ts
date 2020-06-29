import { Field, InputType } from 'type-graphql';

@InputType()
export class IUpdateRestaurantUserCapacity {
  @Field({ nullable: false })
  restauranId: string;

  @Field({ nullable: false })
  bookSize: number;

  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  date: Date;
}

@InputType()
export class IDeleteReservation {
  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  reservationId: string;
}
