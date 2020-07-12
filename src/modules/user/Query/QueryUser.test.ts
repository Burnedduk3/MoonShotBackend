import { Reservation } from '@entities/Reservation.entity';
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

const meQuery = `
query {
  user {
    me {
      id
      userID
      phone
      username
    }
  }
}
`;

const getRestaurants = `
query {
  user {
\t\tgetRestaurants(data:{initialId:1}){
      error
      message
      data{
        id
        restaurantIdentifier
        name
      }
      message
    }
  }
}
`;

const gerReservations = `
query {
  user {
    getAllReservation {
      error
      message
      data {
        id
        reservationIdentifier
        peopleQuantities
      }
      message
    }
  }
}
`;

const getReservationById = `
query($reservationId: String!){
  user{
    getReservationById(data:{reservationId:$reservationId}){
      error
      data{
        reservationIdentifier
        peopleQuantities
      }
      message
    }
  }
}
`;

const updateUser = `
query(
        $firstName :String!
        $secondName:String!
        $firstLastname:String!
        $secondLastname:String!
) {
  user {
    updateUser(
      data: {
        firstName: $firstName
        secondName: $secondName
        firstLastname: $firstLastname
        secondLastname: $secondLastname
      }
    ){
      error
      message
      user{
        id
        firstName
        secondName
        firstLastname
        secondLastname
      }
    }
  }
}
`;

const fakeUser = {
  phone: faker.phone.phoneNumber(),
  userID: faker.commerce.department(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.name.jobType(),
  password: faker.name.firstName(),
  email: faker.name.title(),
};

describe('User Query resolver', () => {
  it('should get userInformation', async () => {
    let user = await User.findOne({ username: fakeUser.username });
    if (!user) {
      user = await User.create({ ...fakeUser }).save();
    }
    const token = await jwtSign({
      username: user.username,
      type: 'test',
      role: 'business',
    });

    if (!token) throw new Error('error creating token');

    const response = await gCall({
      source: meQuery,
      accessToken: token,
    });

    expect(response.data?.user.me.phone).toBe(fakeUser.phone);
    expect(response.data?.user.me.username).toBe(fakeUser.username);
  });

  it('should not find user', async () => {
    const token = await jwtSign({
      username: 'wrong username',
      type: 'test',
      role: 'admin',
    });
    if (token === false) throw new Error('error creating token');
    const response = await gCall({
      source: meQuery,
      accessToken: token,
    });
    expect(response.data?.user.me).toBe(null);
  });

  it('should find restaurants', async () => {
    const token = await jwtSign({
      username: 'SebastianRam',
      type: 'test',
      role: 'user',
    });
    if (token === false) throw new Error('error creating token');
    const response = await gCall({
      source: getRestaurants,
      accessToken: token,
    });
    expect(response.data?.user.getRestaurants.error).toBeFalsy();
    expect(response.data?.user.getRestaurants.data).toBeDefined;
    expect(response.data?.user.getRestaurants.data.length).toBeGreaterThan(0);
    expect(response.data?.user.getRestaurants.message).toBeNull();
  });

  it('should find reservations', async () => {
    const token = await jwtSign({
      username: 'SebastianRam',
      type: 'test',
      role: 'user',
    });
    if (token === false) throw new Error('error creating token');
    const response = await gCall({
      source: gerReservations,
      accessToken: token,
    });
    expect(response.data?.user.getAllReservation.error).toBeFalsy();
    expect(response.data?.user.getAllReservation.data).toBeDefined;
    expect(response.data?.user.getAllReservation.message).toBeNull();
  });

  it('should Not find reservations', async () => {
    const token = await jwtSign({
      username: 'asdasdsfd',
      type: 'test',
      role: 'user',
    });
    if (token === false) throw new Error('error creating token');
    const response = await gCall({
      source: gerReservations,
      accessToken: token,
    });
    expect(response.data?.user.getAllReservation.error).toBeTruthy();
    expect(response.data?.user.getAllReservation.data).toBeNull;
    expect(response.data?.user.getAllReservation.message).toBeDefined();
  });

  it('should find reservations by id', async () => {
    const token = await jwtSign({
      username: 'SebastianRam',
      type: 'test',
      role: 'user',
    });
    const reservation = await Reservation.create({
      peopleQuantities: 20,
      reservationTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }).save();
    if (token === false) throw new Error('error creating token');
    const response = await gCall({
      source: getReservationById,
      accessToken: token,
      variableValues: {
        reservationId: reservation.reservationIdentifier,
      },
    });
    expect(response.data?.user.getReservationById.error).toBeFalsy();
    expect(response.data?.user.getReservationById.data).toBeDefined();
    expect(response.data?.user.getReservationById.message).toBeNull();
  });

  it('should Not find reservations by id', async () => {
    const token = await jwtSign({
      username: 'SebastianRam',
      type: 'test',
      role: 'user',
    });
    if (token === false) throw new Error('error creating token');
    const response = await gCall({
      source: getReservationById,
      accessToken: token,
      variableValues: {
        reservationId: 'sdjklfhkajsdhf',
      },
    });
    expect(response.data?.user.getReservationById.error).toBeTruthy();
    expect(response.data?.user.getReservationById.data).toBeNull();
    expect(response.data?.user.getReservationById.message).toBeDefined();
  });

  it('should update user info', async () => {
    const user = await User.findOne({ username: 'SantiagoPetro' });
    if (!user) throw new Error('No user');
    const token = await jwtSign({
      username: 'SantiagoPetro',
      type: 'test',
      role: 'business',
    });

    if (!token) throw new Error('error creating token');

    const response = await gCall({
      source: updateUser,
      accessToken: token,
      variableValues: {
        firstName: 'asdasd',
        secondName: 'asdasd',
        firstLastname: 'asdkjlasdhbfd',
        secondLastname: 'asdkjlhjadskjdfhn',
      },
    });

    expect(response.data?.user.updateUser.user).toBeDefined();
    expect(response.data?.user.updateUser.user.firstName).toBe('asdasd');
    expect(response.data?.user.updateUser.user.secondName).toBe('asdasd');
    expect(response.data?.user.updateUser.user.firstLastname).toBe('asdkjlasdhbfd');
    expect(response.data?.user.updateUser.user.secondLastname).toBe('asdkjlhjadskjdfhn');
    expect(response.data?.user.updateUser.error).toBeFalsy();
    expect(response.data?.user.updateUser.message).toBeNull();
  });
});
