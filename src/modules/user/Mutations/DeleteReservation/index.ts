import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { IDeleteReservation } from '@modules/user/Mutations/User.inputs';
import { UpdateRestaurantUserResponse } from '@modules/user/Mutations/user.types';
import { getConnection } from 'typeorm';

export const deleteReservation = async (data: IDeleteReservation): Promise<UpdateRestaurantUserResponse> => {
  try {
    const connection = await getConnection();
    const reservationToDelete = await Reservation.findOne({
      where: { reservationIdentifier: data.reservationId },
      relations: ['restaurant'],
    });
    if (!reservationToDelete) throw new Error('Reservation not Found');

    const rest = await Restaurant.findOne(reservationToDelete.restaurant);
    const user = await User.findOne({ where: { username: data.username } });

    if (!rest) throw new Error('Restaurant not Found');
    if (!user) throw new Error('User not Found');

    if (rest.reservationCapacity - reservationToDelete.peopleQuantities >= 0) {
      rest.reservationCapacity -= reservationToDelete.peopleQuantities;
    } else {
      /* istanbul ignore next */
      throw new Error('Capacity can not be below 0');
    }

    await connection.createQueryBuilder().update(Restaurant).set(rest).where('id = :id', { id: rest.id }).execute();

    rest.reservationCapacity -= reservationToDelete.peopleQuantities;

    rest.capacity -= reservationToDelete.peopleQuantities;

    connection
      .createQueryBuilder()
      .update(Reservation)
      .set({ active: false })
      .where('id = :id', { id: reservationToDelete.id })
      .execute();

    return {
      error: false,
      data: rest,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
    /* istanbul ignore next */
    return {
      error: true,
      message: 'Could not update Capacity',
    };
  }
};
