import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { IUpdateRestaurantUserCapacity } from '@modules/user/Mutations/User.inputs';
import { UserReservationResponse } from '@modules/user/Mutations/user.types';
import { getConnection } from 'typeorm';

export const bookUpdate = async (data: IUpdateRestaurantUserCapacity): Promise<UserReservationResponse> => {
  try {
    const rest = await Restaurant.findOne({ where: { restaurantIdentifier: data.restauranId } });
    const user = await User.findOne({ where: { username: data.username } });

    if (!rest) throw new Error('Restaurant not Found');
    if (!user) throw new Error('User not Found');

    if (rest.capacity + data.bookSize <= rest.maxCapacity) {
      rest.capacity += data.bookSize;
    } else {
      throw new Error('Max capacity reached');
    }

    const reservation = await Reservation.create({
      peopleQuantities: data.bookSize,
      reservationTime: data.date,
    }).save();

    if (!reservation) throw new Error('Could not create reservation');

    await getConnection().createQueryBuilder().relation(Reservation, 'restaurant').of(reservation).set(rest);
    await getConnection().createQueryBuilder().relation(Reservation, 'owner').of(reservation).set(user);
    reservation.restaurant = rest;
    reservation.owner = user;

    await getConnection()
      .createQueryBuilder()
      .update(Restaurant)
      .set(rest)
      .where('id = :id', { id: rest.id })
      .execute();

    return {
      error: false,
      data: reservation,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
    return {
      error: true,
      message: 'Could not update Capacity',
    };
  }
};
