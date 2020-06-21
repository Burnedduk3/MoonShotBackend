import { LoginTypes } from '@modules/auth/login/Login.types';
import { Field, ObjectType } from 'type-graphql';
import { RegisterTypes } from './register/Register.types';

@ObjectType({ description: 'Auth resolvers' })
export class AuthTypes {
  @Field()
  register: RegisterTypes;

  @Field()
  login: LoginTypes;
}
