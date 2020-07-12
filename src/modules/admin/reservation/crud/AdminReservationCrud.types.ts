import { Reservation } from '@entities/Reservation.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Admin Reservation CRUD types response' })
export class AdminReservationCrudResponse {
  @Field({ nullable: true })
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => Reservation, { nullable: true })
  data?: Reservation;
}

@ObjectType({ description: 'admin Reservation CRUD types response' })
export class AdminReservationArrayCrudResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [Reservation], { nullable: true })
  data?: Reservation[];
}

@ObjectType({ description: 'admin Reservation CRUD types' })
export class AdminReservationCrudTypes {
  @Field(() => AdminReservationCrudResponse, { nullable: true })
  updateReservation: AdminReservationCrudResponse;

  @Field(() => AdminReservationCrudResponse, { nullable: true })
  updateRelationReservation: AdminReservationCrudResponse;

  @Field(() => AdminReservationCrudResponse, { nullable: true })
  createReservation: AdminReservationCrudResponse;

  @Field(() => AdminReservationCrudResponse, { nullable: true })
  deleteReservation: AdminReservationCrudResponse;

  @Field(() => AdminReservationArrayCrudResponse, { nullable: true })
  getAllReservation: AdminReservationArrayCrudResponse;

  @Field(() => AdminReservationCrudResponse, { nullable: true })
  findReservationById: AdminReservationCrudResponse;
}
