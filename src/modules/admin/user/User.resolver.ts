import { AdminUserCrudTypes } from '@modules/admin/user/crud/AdminUserCrud.types';
import { FieldResolver, Resolver } from 'type-graphql';
import { AdminUserTypes } from './AdminUser.types';

@Resolver(() => AdminUserTypes)
export class AdminUserResolver {
  @FieldResolver()
  crud(): AdminUserCrudTypes {
    return new AdminUserCrudTypes();
  }
}
