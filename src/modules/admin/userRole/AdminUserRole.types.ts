import { AdminUserRoleCrudTypes } from '@modules/admin/userRole/crud/AdminUserRoleCrud.types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'user Role Types' })
export class AdminUserRoleTypes {
  @Field()
  crud: AdminUserRoleCrudTypes;
}
