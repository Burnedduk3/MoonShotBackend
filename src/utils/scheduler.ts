import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import * as cron from 'node-cron';
import { getConnection } from 'typeorm';

export const updateActiveReserves = () => {
  try {
    cron.schedule('* * */1  * * *', async () => {
      const connection = getConnection();
      const maximum = new Date();
      maximum.setHours(new Date().getHours() - 6);
      maximum.setSeconds(0);
      maximum.setMinutes(0);
      maximum.setMilliseconds(0);

      const minimum = new Date(0);
      minimum.setFullYear(2019);

      const reservations = await connection
        .getRepository(Reservation)
        .createQueryBuilder('reservations')
        .where('reservations.reservationTime between :minimum AND :maximum', {
          maximum: maximum.toISOString().slice(0, 19).replace('T', ' '),
          minimum: minimum.toISOString().slice(0, 19).replace('T', ' '),
        })
        .andWhere('reservations.active = true')
        .getMany();

      reservations.map(async (reservation) => {
        reservation.active = false;
        await connection
          .createQueryBuilder()
          .update(Reservation)
          .set(reservation)
          .where('id = :id', { id: reservation.id })
          .execute();
      });
    });
  } catch (e) {}
};

export const scheduledDataBaseUpdate = () => {
  try {
    cron.schedule('*/1 * * * * *', async () => {
      const connection = getConnection();
      const minimumHour = new Date();
      minimumHour.setHours(new Date().getHours() - 5);
      minimumHour.setSeconds(0);
      minimumHour.setMinutes(0);
      minimumHour.setMilliseconds(0);

      const maximumHour = new Date();
      maximumHour.setHours(new Date().getHours() + 1 - 5);
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
        .getMany();
      const restaurants = await Restaurant.find();
      restaurants.map(async (restaurant) => {
        try {
          let peopleTotal = 0;
          reservations.map((reservation) => {
            if (restaurant.restaurantIdentifier === reservation.restaurant.restaurantIdentifier && reservation.active) {
              peopleTotal += reservation.peopleQuantities;
            }
          });
          restaurant.reservationCapacity = peopleTotal;
          await connection
            .createQueryBuilder()
            .update(Restaurant)
            .set(restaurant)
            .where('id = :id', { id: restaurant.id })
            .execute();
        } catch (e) {
          // write to log
        }
      });
    });
  } catch (e) {
    if (e instanceof Error) {
      // writte to event log
    }
  }
};
