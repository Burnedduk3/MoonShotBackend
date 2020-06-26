import { AdminUserCrudTypes } from '@modules/admin/user/crud/AdminUserCrud.types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'UserTypes Types' })
export class AdminUserTypes {
  @Field()
  crud: AdminUserCrudTypes;
}
