import { AdminUserRoleCrudTypes } from '@modules/admin/userRole/crud/AdminUserRoleCrud.types';
import { FieldResolver, Resolver } from 'type-graphql';
import { AdminUserRoleTypes } from './AdminUserRole.types';

@Resolver(() => AdminUserRoleTypes)
export class AdminUserRoleResolver {
  @FieldResolver()
  crud(): AdminUserRoleCrudTypes {
    return new AdminUserRoleCrudTypes();
  }
}
