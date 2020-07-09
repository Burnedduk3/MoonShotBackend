import { Field, InputType } from 'type-graphql';

@InputType()
export class ISendConfirmationNumber {
  @Field({ nullable: false })
  username: string;
}

@InputType()
export class IConfirmSentCode {
  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  code: number;
}
