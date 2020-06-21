import { AdminUserCrudTypes } from '@modules/admin/user/crud/AdminUserCrud.types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'User Types' })
export class AdminUserTypes {
  @Field()
  crud: AdminUserCrudTypes;
}
