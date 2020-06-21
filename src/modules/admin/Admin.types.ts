import { AdminUserRoleTypes } from '@modules/admin/userRole/AdminUserRole.types';
import { Field, ObjectType } from 'type-graphql';
@ObjectType({ description: 'admin Functions' })
export class AdminTypes {
  @Field()
  UserRole: AdminUserRoleTypes;

  // @Field()
  // User: AdminRestaurantTypes;

  // @Field()
  // LawyerCategory: AdminLawyerCategoryTypes;
}
