import { Field, InputType } from 'type-graphql';

@InputType()
export class CrudRestaurantUpdateInput {
  @Field({ nullable: false })
  name?: string;

  @Field({ nullable: false })
  address?: string;

  @Field({ nullable: false })
  phoneNumber?: string;
}

@InputType()
export class CrudRestaurantUpdateRelationsInputs {
  @Field({ nullable: true })
  ownerId?: number;

  @Field({ nullable: true })
  recipeId?: number;

  @Field({ nullable: true })
  reservationId?: number;
}

@InputType()
export class CrudCreateRestaurantInputs {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  address: string;

  @Field({ nullable: false })
  phoneNumber: string;
}
