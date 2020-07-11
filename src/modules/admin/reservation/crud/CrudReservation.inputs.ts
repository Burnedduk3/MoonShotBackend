import { Field, InputType } from 'type-graphql';

@InputType()
export class CrudReservationUpdateInput {
  @Field({ nullable: true })
  peopleQuantities: number;

  @Field({ nullable: true })
  date: Date;
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

  @Field({ nullable: false })
  date: Date;
}
