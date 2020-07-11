import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { UserRole } from '@entities/UserRole.entity';
import { AdminUserCrudResponse } from '@modules/admin/user/crud/AdminUserCrud.types';
import { CrudUserUpdateRelationsInputs } from '@modules/admin/user/crud/CrudUser.inputs';
import { getConnection } from 'typeorm';

export const updateUserRelationsHandler = async (
  id: number,
  data: CrudUserUpdateRelationsInputs,
  action: string,
): Promise<AdminUserCrudResponse> => {
  try {
    const user = await User.findOne(id, {
      relations: ['role', 'restaurants', 'reservations'],
    });

    if (!user) throw new Error('Restaurant not found');

    if (action === 'add') {
      if (data.restaurantId) {
        const restaurant = await Restaurant.findOne(data.restaurantId);
        if (!restaurant) throw new Error('recipe not Found');
        await getConnection().createQueryBuilder().relation(User, 'restaurants').of(user).add(restaurant);
        user.restaurants.push(restaurant);
      }

      if (data.reservationId) {
        const reservation = await Reservation.findOne(data.reservationId);
        if (!reservation) throw new Error('recipe not Found');
        await getConnection().createQueryBuilder().relation(User, 'reservations').of(user).add(reservation);
        user.reservations.push(reservation);
      }
    }

    if (action === 'delete') {
      if (data.restaurantId) {
        const restaurant = await Restaurant.findOne(data.restaurantId);
        if (!restaurant) throw new Error('recipe not Found');
        await getConnection().createQueryBuilder().relation(User, 'restaurants').of(user).remove(restaurant);
        const indexToDelete = user.restaurants.findIndex((element: Restaurant) => {
          if (element.restaurantIdentifier === restaurant.restaurantIdentifier) {
            return true;
          }
          /* istanbul ignore next */
          return false;
        });
        if (indexToDelete !== -1) {
          user.restaurants.splice(indexToDelete, 1);
        }
      }

      if (data.reservationId) {
        const reservation = await Reservation.findOne(data.reservationId);
        if (!reservation) throw new Error('recipe not Found');
        await getConnection().createQueryBuilder().relation(User, 'reservations').of(user).remove(user);
        const indexToDelete = user.reservations.findIndex((element: Reservation) => {
          if (element.reservationIdentifier === reservation.reservationIdentifier) {
            return true;
          }
          /* istanbul ignore next */
          return false;
        });
        if (indexToDelete !== -1) {
          user.reservations.splice(indexToDelete, 1);
        }
      }
    }

    if (data.roleId) {
      const userRole = await UserRole.findOne(data.roleId);
      if (!userRole) throw new Error('No user not found');
      await getConnection().createQueryBuilder().relation(User, 'role').of(user).set(userRole);
      user.role = userRole;
    }

    return {
      error: false,
      data: user,
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: true,
        message: e.message,
      };
    }
    /* istanbul ignore next */
    return {
      error: true,
      message: 'Error updateUserRelationsHandler',
    };
  }
};
