import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import { jwtSign } from '@utils/jwt';
import faker from 'faker';
import { Connection } from 'typeorm';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const createRserevation = `
query($peopleQuantities: Float!, $date: DateTime!) {
  admin {
    Reservation {
      crud {
        createReservation(
          data: {
            peopleQuantities: $peopleQuantities
            date: $date
          }
        ) {
          error
          message
          data {
            reservationIdentifier
            active
          }
        }
      }
    }
  }
}
`;

const findOne: string = `
query($id: Float!) {
  admin {
    Reservation {
      crud {
        findReservationById(
          id:$id
        ) {
          error
          message
          data {
            reservationIdentifier
            active
          }
        }
      }
    }
  }
}
`;

const deleteReservation: string = `
query($id: Float!) {
  admin {
    Reservation {
      crud {
        deleteReservation(
          id:$id
        ) {
          error
          message
        }
      }
    }
  }
}
`;

const getAll = `
query {
  admin {
    Reservation {
      crud {
        getAllReservation {
          error
          message
          data{
            id
            reservationIdentifier
            peopleQuantities
            active
          }
        }
      }
    }
  }
}
`;

const updateReservation: string = `
query($id: Float!, $people: Float!, $date: DateTime!) {
  admin {
    Reservation {
      crud {
        updateReservation(
          id: $id
          data: { peopleQuantities: $people, date: $date }
        ) {
          error
          message
          data {
            id
            reservationIdentifier
            peopleQuantities
            active
            reservationTime
          }
        }
      }
    }
  }
}
`;

const updateRelations = `
query($id: Float! $restaurantId:Float! $ownerId:Float!) {
  admin {
    Reservation {
      crud {
        updateRelationReservation(
          id: $id
          data: {  restaurantId:$restaurantId, ownerId: $ownerId}
        ) {
          error
          message
          data {
            id
            reservationIdentifier
            peopleQuantities
            active
            reservationTime
            restaurant{
              restaurantIdentifier
            }
            owner{
              username
            }
          }
        }
      }
    }
  }
}
`;

const fakeUser = {
  phone: faker.phone.phoneNumber(),
  userID: faker.name.lastName(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.internet.ipv6(),
  password: faker.name.firstName(),
  email: faker.name.firstName(),
};

const fakeUser2 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.name.prefix(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.name.jobDescriptor(),
  password: faker.name.firstName(),
  email: faker.lorem.word(),
};

describe('Admin Reservation CRUD test', () => {
  it('should Create Reservation', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const time = new Date();
    const response = await gCall({
      source: createRserevation,
      accessToken,
      variableValues: {
        peopleQuantities: Math.floor(Math.random() * Math.floor(10000)) + 200,
        date: time.toISOString().slice(0, 19).replace('T', ' '),
      },
    });
    expect(response.data?.admin.Reservation.crud.createReservation.error).toBe(false);
    expect(response.data?.admin.Reservation.crud.createReservation.data.active).toBe(true);
    expect(response.data?.admin.Reservation.crud.createReservation.data.reservationIdentifier).toBeDefined();
  });

  it('should Not Create Reservation', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: createRserevation,
      accessToken,
      variableValues: {
        peopleQuantities: Math.floor(Math.random() * Math.floor(10000)) + 200,
      },
    });
    expect(response.errors).toBeDefined();
  });

  it('should find One reservation', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const time = new Date();

    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: time.toISOString().slice(0, 19).replace('T', ' '),
    }).save();
    const response = await gCall({
      source: findOne,
      accessToken,
      variableValues: {
        id: reservation.id,
      },
    });
    expect(response.data?.admin.Reservation.crud.findReservationById.error).toBe(false);
    expect(response.data?.admin.Reservation.crud.findReservationById.data.active).toBe(true);
    expect(response.data?.admin.Reservation.crud.findReservationById.data.reservationIdentifier).toBeDefined();
  });

  it('should NOT find One reservation', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: findOne,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
      },
    });
    expect(response.data?.admin.Reservation.crud.findReservationById.error).toBe(true);
    expect(response.data?.admin.Reservation.crud.findReservationById.message).toBeDefined();
  });

  it('should Delete One reservation', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const time = new Date();
    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: time.toISOString().slice(0, 19).replace('T', ' '),
    }).save();

    const response = await gCall({
      source: deleteReservation,
      accessToken,
      variableValues: {
        id: reservation.id,
      },
    });
    expect(response.data?.admin.Reservation.crud.deleteReservation.error).toBe(false);
    expect(response.data?.admin.Reservation.crud.deleteReservation.message).toBeNull();
  });

  it('should Not Delete One reservation', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const response = await gCall({
      source: deleteReservation,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
      },
    });
    expect(response.data?.admin.Reservation.crud.deleteReservation.error).toBe(true);
    expect(response.data?.admin.Reservation.crud.deleteReservation.message).toBeDefined();
  });

  it('should Find all reservation', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const response = await gCall({
      source: getAll,
      accessToken,
    });
    expect(response.data?.admin.Reservation.crud.getAllReservation.error).toBe(false);
    expect(response.data?.admin.Reservation.crud.getAllReservation.message).toBeNull();
    expect(response.data?.admin.Reservation.crud.getAllReservation.data).toBeDefined();
  });

  it('Should update reservation', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: '2020-07-30 14:38:54.85',
    }).save();
    if (!reservation) throw new Error('Error in reservation update test');
    const number = Math.floor(Math.random() * Math.floor(10000)) + 200;
    const response = await gCall({
      source: updateReservation,
      accessToken,
      variableValues: {
        id: reservation.id,
        people: number,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      },
    });
    expect(response.data?.admin.Reservation.crud.updateReservation.error).toBe(false);
    expect(response.data?.admin.Reservation.crud.updateReservation.message).toBeNull();
    expect(response.data?.admin.Reservation.crud.updateReservation.data).toBeDefined();
    expect(response.data?.admin.Reservation.crud.updateReservation.data.peopleQuantities).toBe(number);
  });

  it('Should Not update reservation', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: '2020-07-30 14:38:54.85',
    }).save();
    if (!reservation) throw new Error('Error in reservation update test');

    const response = await gCall({
      source: updateReservation,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
        people: 12,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      },
    });
    expect(response.data?.admin.Reservation.crud.updateReservation.error).toBe(true);
    expect(response.data?.admin.Reservation.crud.updateReservation.message).toBeDefined();
    expect(response.data?.admin.Reservation.crud.updateReservation.data).toBeNull();
  });

  it('Should update reservation Relations', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: '2020-07-30 14:38:54.85',
    }).save();
    const user = await User.create(fakeUser).save();
    const restaurant = await Restaurant.create({
      name: 'test',
      address: 'asdasd',
      phoneNumber: '12312332',
      maxCapacity: 200,
    }).save();
    if (!reservation || !restaurant || !user) throw new Error('Error in reservation update test');
    const response = await gCall({
      source: updateRelations,
      accessToken,
      variableValues: {
        id: reservation.id,
        restaurantId: restaurant.id,
        ownerId: user.id,
      },
    });
    expect(response.data?.admin.Reservation.crud.updateRelationReservation.error).toBe(false);
    expect(response.data?.admin.Reservation.crud.updateRelationReservation.message).toBeNull();
    expect(response.data?.admin.Reservation.crud.updateRelationReservation.data).toBeDefined();
    expect(response.data?.admin.Reservation.crud.updateRelationReservation.data.restaurant.restaurantIdentifier).toBe(
      restaurant.restaurantIdentifier,
    );
    expect(response.data?.admin.Reservation.crud.updateRelationReservation.data.owner.username).toBe(user.username);
  });

  it('Should Not update reservation Relation', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: '2020-07-30 14:38:54.85',
    }).save();
    const user = await User.create(fakeUser2).save();
    const restaurant = await Restaurant.create({
      name: 'test',
      address: 'asdasd',
      phoneNumber: '12312332',
      maxCapacity: 200,
    }).save();
    if (!reservation || !restaurant || !user) throw new Error('Error in reservation update test');

    const response = await gCall({
      source: updateRelations,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
        restaurantId: restaurant.id,
        ownerId: user.id,
      },
    });
    expect(response.data?.admin.Reservation.crud.updateRelationReservation.error).toBe(true);
    expect(response.data?.admin.Reservation.crud.updateRelationReservation.message).toBeDefined();
    expect(response.data?.admin.Reservation.crud.updateRelationReservation.data).toBeNull();
  });
});
