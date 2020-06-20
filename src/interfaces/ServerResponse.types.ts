import { User } from '@entities/User.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ServerResponse {
  @Field()
  error: boolean;
  @Field()
  data: User;
}
