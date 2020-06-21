import { Field, ObjectType } from 'type-graphql';
import { LoginTypes } from './login/Login.types';
import { RegisterTypes } from './register/Register.types';

@ObjectType({ description: 'Auth resolvers' })
export class AuthTypes {
  @Field()
  register: RegisterTypes;

  @Field()
  login: LoginTypes;
}
