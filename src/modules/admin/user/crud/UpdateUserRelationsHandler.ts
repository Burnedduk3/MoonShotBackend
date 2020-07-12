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
      relations: ['role', 'restaurant', 'reservations'],
    });

    if (!user) throw new Error('Restaurant not found');

    if (data.restaurantId) {
      const restaurant = await Restaurant.findOne(data.restaurantId);
      if (!restaurant) throw new Error('recipe not Found');
      await getConnection().createQueryBuilder().relation(User, 'restaurant').of(user).set(restaurant);
      user.restaurant = restaurant;
    }

    if (action === 'add') {
      if (data.reservationId) {
        const reservation = await Reservation.findOne(data.reservationId);
        if (!reservation) throw new Error('recipe not Found');
        await getConnection().createQueryBuilder().relation(User, 'reservations').of(user).add(reservation);
        user.reservations.push(reservation);
      }
    }

    if (action === 'delete') {
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
