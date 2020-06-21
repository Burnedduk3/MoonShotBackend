import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterResolverInputs {
  @Field()
  @MinLength(8, { message: 'Less than 8' })
  password: string;

  @Field()
  username: string;

  @Field()
  phone: string;

  @Field()
  userID: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  secondName?: string;

  @Field()
  firstLastname: string;

  @Field({ nullable: true })
  secondLastname?: string;

  @Field()
  role: string;
}
