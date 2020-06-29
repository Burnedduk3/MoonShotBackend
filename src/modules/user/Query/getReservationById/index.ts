import { Reservation } from '@entities/Reservation.entity';
import { IGetReservationById } from '@modules/user/Query/User.inputs';
import { IUserReservationResponse } from '../User.types';

export const getReservationById = async (data: IGetReservationById): Promise<IUserReservationResponse> => {
  try {
    const reservation = await Reservation.findOne({
      where: { reservationIdentifier: data.reservationId },
      relations: ['restaurant'],
    });

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
