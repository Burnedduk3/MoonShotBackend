import { Field, InputType } from 'type-graphql';

@InputType()
export class CrudRecipesUpdateInput {
  @Field({ nullable: false })
  name?: string;

  @Field({ nullable: false })
  address?: string;

  @Field({ nullable: false })
  phoneNumber?: string;
}

@InputType()
export class CrudRecipesUpdateRelationsInputs {
  @Field({ nullable: true })
  restaurantId?: number;
}

@InputType()
export class CrudCreateRecipesInputs {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  address: string;

  @Field({ nullable: false })
  phoneNumber: string;
}
