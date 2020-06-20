import { User } from '@entities/User.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'User/UpdateUser response' })
export class UpdateUserResponse {
  @Field()
  error: boolean;

  @Field({ nullable: true })
  user?: User;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType({ description: 'UserResovers' })
export class UserTypes {
  @Field({ nullable: true })
  me: User;

  @Field()
  updateUser: UpdateUserResponse;
}
