import { AdminRecipesTypes } from '@modules/admin/recipes/AdminRecipes.types';
import { AdminReservationTypes } from '@modules/admin/reservation/AdminReservation.types';
import { AdminRestaurantTypes } from '@modules/admin/restaurants/AdminRestaurant.types';
import { AdminUserTypes } from '@modules/admin/user/AdminUser.types';
import { AdminUserRoleTypes } from '@modules/admin/userRole/AdminUserRole.types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'admin Functions' })
export class AdminTypes {
  @Field({ nullable: true })
  UserRole: AdminUserRoleTypes;

  @Field({ nullable: true })
  User: AdminUserTypes;

  @Field({ nullable: true })
  Restaurants: AdminRestaurantTypes;

  @Field({ nullable: true })
  Recipes: AdminRecipesTypes;

  @Field({ nullable: true })
  Reservation: AdminReservationTypes;
}
