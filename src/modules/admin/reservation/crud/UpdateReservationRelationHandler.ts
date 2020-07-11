import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { AdminReservationCrudResponse } from '@modules/admin/reservation/crud/AdminReservationCrud.types';
import { CrudReservationUpdateRelationsInputs } from '@modules/admin/reservation/crud/CrudReservation.inputs';
import { getConnection } from 'typeorm';

export const UpdateReservationRelationsHandler = async (
  id: number,
  data: CrudReservationUpdateRelationsInputs,
): Promise<AdminReservationCrudResponse> => {
  try {
    const reservation = await Reservation.findOne(id, {
      relations: ['owner', 'restaurant'],
    });

    if (!reservation) throw new Error('reservation not found');

    if (data.ownerId) {
      const user = await User.findOne(data.ownerId);
      if (!user) throw new Error('user not Found');
      await getConnection().createQueryBuilder().relation(Reservation, 'owner').of(reservation).set(user);
      reservation.owner = user;
    }

    if (data.restaurantId) {
      const restaurant = await Restaurant.findOne(data.restaurantId);
      if (!restaurant) throw new Error('No restaurant was found');
      await getConnection().createQueryBuilder().relation(Reservation, 'restaurant').of(reservation).set(restaurant);
      reservation.restaurant = restaurant;
    }

    return {
      error: false,
      data: reservation,
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
      message: 'Error updateReservationRelationHandler',
    };
  }
};
