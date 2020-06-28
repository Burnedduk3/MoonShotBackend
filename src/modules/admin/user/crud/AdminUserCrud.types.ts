import { User } from '@entities/User.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Admin BusinessTypes CRUD types response' })
export class AdminUserCrudResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => User, { nullable: true })
  data?: User;
}

@ObjectType({ description: 'admin BusinessTypes CRUD types response' })
export class AdminUserArrayCrudResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [User], { nullable: true })
  data?: User[];
}

@ObjectType({ description: 'admin BusinessTypes CRUD types' })
export class AdminUserCrudTypes {
  @Field(() => AdminUserCrudResponse, { nullable: true })
  updateUser: AdminUserCrudResponse;

  @Field(() => AdminUserCrudResponse, { nullable: true })
  updateUserRelations: AdminUserCrudResponse;

  @Field(() => AdminUserCrudResponse, { nullable: true })
  createUser: AdminUserCrudResponse;

  @Field(() => AdminUserCrudResponse, { nullable: true })
  deleteUser: AdminUserCrudResponse;

  @Field(() => AdminUserArrayCrudResponse, { nullable: true })
  getAllUser: AdminUserArrayCrudResponse;

  @Field(() => AdminUserCrudResponse, { nullable: true })
  findUserById: AdminUserCrudResponse;
}
