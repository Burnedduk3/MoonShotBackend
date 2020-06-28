import { Field, InputType } from 'type-graphql';

@InputType()
export class CrudReservationUpdateInput {
  @Field({ nullable: false })
  peopleQuantities: number;
}

@InputType()
export class CrudReservationUpdateRelationsInputs {
  @Field({ nullable: true })
  restaurantId?: number;

  @Field({ nullable: true })
  ownerId?: number;
}

@InputType()
export class CrudCreateReservationInputs {
  @Field({ nullable: false })
  peopleQuantities: number;
}
