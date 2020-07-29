import { Reservation } from '@entities/Reservation.entity';
import { IGetReservationById } from '@modules/user/Query/User.inputs';
import { getConnection } from 'typeorm';
import { IUserReservationResponse } from '../User.types';

export const getReservationById = async (data: IGetReservationById): Promise<IUserReservationResponse> => {
  try {
    const connection = getConnection();

    const reservation = await connection
      .getRepository(Reservation)
      .createQueryBuilder('reservations')
      .leftJoinAndSelect('reservations.restaurant', 'restaurant')
      .leftJoinAndSelect('reservations.owner', 'user')
      .where('reservations.reservationIdentifier = :reservationId', { reservationId: data.reservationId })
      .getOne();

    if (!reservation) throw new Error('No reservation was found');

    return {
      error: false,
      data: reservation,
    };
  } catch (e) {
    return {
      error: true,
      message: (e as Error).message,
    };
  }
};
