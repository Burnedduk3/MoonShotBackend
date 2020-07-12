import { Restaurant } from '@entities/Restaurant.entity';
import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import { jwtSign } from '@utils/jwt';
import { Connection } from 'typeorm';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const makeReservation = `
mutation($restauranId: String! $username:String! $date:DateTime!) {
  user {
    makeReservation(
      data: {
        restauranId: $restauranId
        bookSize: 2
        username: $username
        date: $date
      }
    ) {
      error
      data {
        reservationIdentifier
        peopleQuantities
        restaurant{
          id
          restaurantIdentifier
        }
        owner{
          username
          phone
        }
      }
      message
    }
  }
}
`;

const deleteReservation = `
mutation($reservationId: String!, $username: String!) {
  user {
    deleteReservation(
      data: { username: $username, reservationId: $reservationId }
    ) {
      error
      message
    }
  }
}
`;

let reservationIdentifier = '';

describe('User Mutation resolver', () => {
  it('should Make Reservation', async () => {
    const token = await jwtSign({
      username: 'SebastianRam',
      type: 'test',
      role: 'user',
    });
    const restaurant = await Restaurant.findOne();
    if (!token || !restaurant) throw new Error('error creating token');

    const response = await gCall({
      source: makeReservation,
      accessToken: token,
      variableValues: {
        restauranId: restaurant.restaurantIdentifier,
        username: 'SebastianRam',
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      },
    });
    expect(response.data?.user.makeReservation.data).toBeDefined();
    expect(response.data?.user.makeReservation.error).toBeFalsy();
    expect(response.data?.user.makeReservation.message).toBeNull();
    reservationIdentifier = response.data?.user.makeReservation.data.reservationIdentifier;
  });

  it('should not Make Reservation', async () => {
    const token = await jwtSign({
      username: 'SebastianRam',
      type: 'test',
      role: 'user',
    });
    const restaurant = await Restaurant.findOne();
    if (!token || !restaurant) throw new Error('error creating token');

    const response = await gCall({
      source: makeReservation,
      accessToken: token,
      variableValues: {
        restauranId: 'asdfasdfdsfdfdsdf',
        username: 'SebastianRam',
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      },
    });

    expect(response.data?.user.makeReservation.data).toBeNull();
    expect(response.data?.user.makeReservation.error).toBeTruthy();
    expect(response.data?.user.makeReservation.message).toBeDefined();
  });

  it('should delete Reservation', async () => {
    const token = await jwtSign({
      username: 'SebastianRam',
      type: 'test',
      role: 'user',
    });
    const restaurant = await Restaurant.findOne();
    if (!token || !restaurant) throw new Error('error creating token');

    const response = await gCall({
      source: deleteReservation,
      accessToken: token,
      variableValues: {
        reservationId: reservationIdentifier,
        username: 'SebastianRam',
      },
    });
    expect(response.data?.user.deleteReservation.error).toBeFalsy();
    expect(response.data?.user.deleteReservation.message).toBeNull();
  });

  it('should not delete Reservation', async () => {
    const token = await jwtSign({
      username: 'SebastianRam',
      type: 'test',
      role: 'user',
    });
    const restaurant = await Restaurant.findOne();
    if (!token || !restaurant) throw new Error('error creating token');

    const response = await gCall({
      source: deleteReservation,
      accessToken: token,
      variableValues: {
        reservationId: "adsfadsfasdf",
        username: 'SebastianRam',
      },
    });

    expect(response.data?.user.deleteReservation.error).toBeTruthy();
    expect(response.data?.user.deleteReservation.message).toBeDefined();
  });
});
