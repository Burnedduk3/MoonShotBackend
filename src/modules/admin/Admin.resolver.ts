import { isAdmin } from '@middlewares/isAdmin';
import { isAuth } from '@middlewares/isAuth';
import { AdminBillTypes } from '@modules/admin/bill/AdminBill.types';
import { AdminRecipesTypes } from '@modules/admin/recipes/AdminRecipes.types';
import { AdminRestaurantTypes } from '@modules/admin/restaurants/AdminRestaurant.types';
import { AdminUserTypes } from '@modules/admin/user/AdminUser.types';
import { AdminUserRoleTypes } from '@modules/admin/userRole/AdminUserRole.types';
import { FieldResolver, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AdminTypes } from './Admin.types';

@Resolver(() => AdminTypes)
export class AdminResolver {
  @Query(() => AdminTypes)
  @UseMiddleware([isAuth, isAdmin])
  admin(): AdminTypes {
    return new AdminTypes();
  }

  @FieldResolver()
  UserRole(): AdminUserRoleTypes {
    return new AdminUserRoleTypes();
  }

  @FieldResolver()
  User(): AdminUserTypes {
    return new AdminUserTypes();
  }

  @FieldResolver()
  Recipes(): AdminRecipesTypes {
    return new AdminRecipesTypes();
  }

  @FieldResolver()
  Restaurants(): AdminRestaurantTypes {
    return new AdminRestaurantTypes();
  }

  @FieldResolver()
  Bill(): AdminBillTypes {
    return new AdminBillTypes();
  }
}
