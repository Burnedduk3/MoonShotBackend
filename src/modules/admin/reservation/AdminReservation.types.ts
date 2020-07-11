import { AdminReservationCrudTypes } from '@modules/admin/reservation/crud/AdminReservationCrud.types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'BusinessTypes Types' })
export class AdminReservationTypes {
  @Field()
  crud: AdminReservationCrudTypes;
}
