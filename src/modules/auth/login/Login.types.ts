import { User } from '@entities/User.entity';
import { JwtTokens } from '@utils/jwt';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Auth/login response' })
export class LoginResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  data?: JwtTokens;
  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  user?: User;
}

@ObjectType({ description: 'Auth/login response' })
export class NewTokensResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  data?: JwtTokens;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType({ description: 'Auth/Register types' })
export class LoginTypes {
  @Field({ nullable: true })
  loginWithUsernameAndPassword: LoginResponse;

  @Field({ nullable: true })
  checkCode: NewTokensResponse;
}
