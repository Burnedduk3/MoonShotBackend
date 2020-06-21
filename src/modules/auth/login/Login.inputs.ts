import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginResolverInputs {
  @Field()
  username: string;
  @Field()
  password: string;
}

@InputType()
export class CheckCodeResoleverInputs {
  @Field()
  phone: string;

  @Field()
  code: number;
}

@InputType()
export class IRefreshTokenInputs {
  @Field()
  refreshToken: string;
}
