import { Companion } from '@entities/Companion.entity';
import { Reservation } from '@entities/Reservation.entity';
import { IAddCompanion } from '@modules/Business/Mutations/Business.inputs';
import { AddCompanionResponse } from '@modules/Business/Mutations/Business.types';
import { getConnection } from 'typeorm';

export const addCompanion = async (data: IAddCompanion, reservationId: string): Promise<AddCompanionResponse> => {
  try {
    const reservation = await Reservation.findOne({ reservationIdentifier: reservationId },{relations:['companions']});

    if (!reservation) throw new Error('No reservation was found');
    if (!data.userID || !data.phone || !data.completeName || !data.address) throw new Error('Not Complete data');

    const companion = await Companion.create({
      userID: data.userID,
      completeName: data.completeName,
      address: data.address,
      phone: data.phone,
    }).save();

    await getConnection().createQueryBuilder().relation(Companion, 'reservation').of(companion).set(reservation);
    await getConnection().createQueryBuilder().relation(Reservation, 'companions').of(reservation).add(companion);

    reservation.companions.push(companion);

    return {
      error: false,
      reservation,
    };
  } catch (error) {
    // istanbul ignore next
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
    /* istanbul ignore next */
    return {
      error: true,
      message: 'Could not create Restaurant',
    };
  }
};
