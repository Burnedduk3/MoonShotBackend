import { Field, InputType } from 'type-graphql';

@InputType()
export class CrudUserUpdateInput {
  @Field({ nullable: false })
  userID?: string;

  @Field({ nullable: false })
  phone?: string;

  @Field({ nullable: false })
  firstName?: string;

  @Field({ nullable: false })
  secondName?: string;

  @Field({ nullable: false })
  firstLastname?: string;

  @Field({ nullable: false })
  secondLastname?: string;
}

@InputType()
export class CrudUserUpdateRelationsInputs {
  @Field({ nullable: true })
  roleId?: number;

  @Field({ nullable: true })
  restaurantId?: number;

  @Field({ nullable: true })
  billId?: number;
}

@InputType()
export class CrudCreateUserInputs {
  @Field({ nullable: false })
  userID: string;

  @Field({ nullable: false })
  phone: string;

  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: true })
  secondName?: string;

  @Field({ nullable: false })
  firstLastname: string;

  @Field({ nullable: true })
  secondLastname?: string;

  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  password: string;

  @Field({ nullable: false })
  email: string;
}
