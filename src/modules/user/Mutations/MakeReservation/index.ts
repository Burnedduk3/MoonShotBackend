import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { IUpdateRestaurantUserCapacity } from '@modules/user/Mutations/User.inputs';
import { UserReservationResponse } from '@modules/user/Mutations/user.types';
import { getConnection } from 'typeorm';

export const bookUpdate = async (data: IUpdateRestaurantUserCapacity): Promise<UserReservationResponse> => {
  try {
    const connection = getConnection();
    const rest = await Restaurant.findOne({ where: { restaurantIdentifier: data.restauranId } });
    const user = await User.findOne({ where: { username: data.username } });

    if (!rest) throw new Error('Restaurant not Found');
    if (!user) throw new Error('User not Found');

    const minimumHour = new Date(data.date);
    minimumHour.setHours(minimumHour.getHours() - 5);
    minimumHour.setSeconds(0);
    minimumHour.setMinutes(0);
    minimumHour.setMilliseconds(0);

    const maximumHour = new Date(data.date);
    maximumHour.setHours(maximumHour.getHours() + 1 - 5);
    maximumHour.setSeconds(0);
    maximumHour.setMinutes(0);
    maximumHour.setMilliseconds(0);

    const reservations = await connection
      .getRepository(Reservation)
      .createQueryBuilder('reservations')
      .leftJoinAndSelect('reservations.restaurant', 'restaurant')
      .where('reservations.reservationTime between :minimum AND :maximum', {
        minimum: minimumHour.toISOString().slice(0, 19).replace('T', ' '),
        maximum: maximumHour.toISOString().slice(0, 19).replace('T', ' '),
      })
      .andWhere('restaurant.restaurantIdentifier = :restaurantId', { restaurantId: data.restauranId })
      .getMany();

    let hourOcupacy = 0;
    reservations.map((item) => {
      /* istanbul ignore next */
      if (item.active) {
        /* istanbul ignore next */
        hourOcupacy += item.peopleQuantities;
      }
    });
    /* istanbul ignore next */
    if (hourOcupacy + rest.locationCapacity + data.bookSize <= rest.maxCapacity) {
      rest.reservationCapacity += data.bookSize;
    } else {
      throw new Error('Max capacity reached');
    }

    const reservation = await Reservation.create({
      peopleQuantities: data.bookSize,
      reservationTime: data.date,
    }).save();

    if (!reservation) throw new Error('Could not create reservation');

    await connection.createQueryBuilder().relation(Reservation, 'restaurant').of(reservation).set(rest);
    await connection.createQueryBuilder().relation(Reservation, 'owner').of(reservation).set(user);
    reservation.restaurant = rest;
    reservation.owner = user;

    await connection.createQueryBuilder().update(Restaurant).set(rest).where('id = :id', { id: rest.id }).execute();

    reservation.restaurant.reservationCapacity += data.bookSize;
    reservation.restaurant.capacity += data.bookSize;
    return {
      error: false,
      data: reservation,
    };
  } catch (error) {
    /* istanbul ignore next */
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
