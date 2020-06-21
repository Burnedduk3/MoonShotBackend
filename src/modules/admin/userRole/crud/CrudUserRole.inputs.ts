import { Field, InputType } from 'type-graphql';

@InputType()
export class CrudUserRoleUpdateInput {
  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class CrudUserRoleUpdateRelationsInputs {
  @Field({ nullable: true })
  user?: number;
}

@InputType()
export class CrudCreateUserRoleInputs {
  @Field({ nullable: true })
  name?: string;
}
