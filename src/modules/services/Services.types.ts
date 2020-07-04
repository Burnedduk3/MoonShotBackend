import { Field, ObjectType } from 'type-graphql';
import {User} from "@entities/User.entity";

@ObjectType({ description: 'update restaurant capacity response' })
export class IVerifyPhoneResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
}

@ObjectType({ description: 'update restaurant capacity response' })
export class IVerifyCodeResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  user?: User;
}

@ObjectType({ description: 'Business Resolver' })
export class ServicesTypes {
  @Field({ nullable: true })
  verifyPhone: IVerifyPhoneResponse;

  @Field({ nullable: true })
  verifyCode: IVerifyCodeResponse;
}
