import { Reservation } from '@entities/Reservation.entity';
import { AdminReservationCrudResponse } from '@modules/admin/reservation/crud/AdminReservationCrud.types';
import { CrudReservationUpdateInput } from '@modules/admin/reservation/crud/CrudReservation.inputs';
import { getConnection } from 'typeorm';

export const updateReservationHandler = async (
  id: number,
  data: CrudReservationUpdateInput,
): Promise<AdminReservationCrudResponse> => {
  try {
    const reservation = await Reservation.findOne(id);

    if (!reservation) throw new Error('reservation not found');

    await getConnection()
      .createQueryBuilder()
      .update(Reservation)
      .set({
        reservationTime: data.date ? data.date : reservation.reservationTime,
        peopleQuantities: data.peopleQuantities ? data.peopleQuantities : reservation.peopleQuantities,
      })
      .where('id = :id', { id })
      .execute();

    reservation.peopleQuantities = data.peopleQuantities ? data.peopleQuantities : reservation.peopleQuantities;
    reservation.reservationTime = data.date ? data.date : reservation.reservationTime;

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
      message: 'Error updateReservationHandler',
    };
  }
};
