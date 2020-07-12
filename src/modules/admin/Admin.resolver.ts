import { isAdmin } from '@middlewares/isAdmin';
import { isAuth } from '@middlewares/isAuth';
import { AdminRecipesTypes } from '@modules/admin/recipes/AdminRecipes.types';
import { AdminReservationTypes } from '@modules/admin/reservation/AdminReservation.types';
import { AdminRestaurantTypes } from '@modules/admin/restaurants/AdminRestaurant.types';
import { AdminUserTypes } from '@modules/admin/user/AdminUser.types';
import { AdminUserRoleTypes } from '@modules/admin/userRole/AdminUserRole.types';
import { FieldResolver, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AdminTypes } from './Admin.types';

@Resolver(/* istanbul ignore next */() => AdminTypes)
export class AdminResolver {
  @Query(/* istanbul ignore next */() => AdminTypes)
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
  Reservation(): AdminReservationTypes {
    return new AdminReservationTypes();
  }
}
