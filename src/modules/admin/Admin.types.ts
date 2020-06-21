import { AdminRecipesTypes } from '@modules/admin/recipes/AdminRecipes.types';
import { AdminRestaurantTypes } from '@modules/admin/restaurants/AdminRestaurant.types';
import { AdminUserTypes } from '@modules/admin/user/AdminUser.types';
import { AdminUserRoleTypes } from '@modules/admin/userRole/AdminUserRole.types';
import { Field, ObjectType } from 'type-graphql';
@ObjectType({ description: 'admin Functions' })
export class AdminTypes {
  @Field()
  UserRole: AdminUserRoleTypes;

  @Field()
  User: AdminUserTypes;

  @Field()
  Restaurants: AdminRestaurantTypes;

  @Field()
  Recipes: AdminRecipesTypes;

  // @Field()
  // LawyerCategory: AdminLawyerCategoryTypes;
}
