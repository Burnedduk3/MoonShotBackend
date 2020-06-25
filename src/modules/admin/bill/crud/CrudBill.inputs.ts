import { Field, InputType } from 'type-graphql';

@InputType()
export class CrudBillUpdateInput {
  @Field({ nullable: false })
  name?: string;

  @Field({ nullable: false })
  totalPrice?: number;

  @Field({ nullable: false })
  description?: string;
}

@InputType()
export class CrudBillUpdateRelationsInputs {
  @Field({ nullable: true })
  restaurantId?: number;

  @Field({ nullable: true })
  userId?: number;
  //
  // @Field({ nullable: true })
  // recipeId?: number;
}

@InputType()
export class CrudCreateBillInputs {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  totalPrice: number;

  @Field({ nullable: false })
  description: string;

}
