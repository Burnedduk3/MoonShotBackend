import { Reservation } from '@entities/Reservation.entity';
import { AdminReservationCrudResponse } from '@modules/admin/reservation/crud/AdminReservationCrud.types';
import { CrudReservationUpdateInput } from '@modules/admin/reservation/crud/CrudReservation.inputs';
import { getConnection } from 'typeorm';

export const updateReservationHandler = async (
  id: number,
  data: CrudReservationUpdateInput,
): Promise<AdminReservationCrudResponse> => {
  try {
    await getConnection()
      .createQueryBuilder()
      .update(Reservation)
      .set({ ...data })
      .where('id = :id', { id })
      .execute();

    const reservation = await Reservation.findOne(id);

    if (!reservation) throw new Error('Restaurant not found');

    return {
      error: false,
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
