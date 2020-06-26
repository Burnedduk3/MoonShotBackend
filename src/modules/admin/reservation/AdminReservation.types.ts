import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'UserTypes Types' })
export class AdminReservationTypes {
  @Field()
  crud: AdminReservationTypes;
}
