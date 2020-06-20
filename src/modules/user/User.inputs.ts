import { Field, InputType } from 'type-graphql';

@InputType()
export class IUpdateUserInputs {
  @Field({ nullable: true })
  firstName?: string;
  @Field({ nullable: true })
  secondName?: string;
  @Field({ nullable: true })
  firstLastname?: string;
  @Field({ nullable: true })
  secondLastname?: string;
}
