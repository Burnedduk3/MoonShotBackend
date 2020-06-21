import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Auth/Register response' })
export class RegisterResponse {
  @Field()
  error: boolean;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType({ description: 'Auth/Register types' })
export class RegisterTypes {
  @Field({ nullable: true })
  register: RegisterResponse;
}
