import { Field, ObjectType } from 'type-graphql';
import {AdminReservationCrudTypes} from "@modules/admin/reservation/crud/AdminReservationCrud.types";

@ObjectType({ description: 'BusinessTypes Types' })
export class AdminReservationTypes {
  @Field()
  crud: AdminReservationCrudTypes;
}
