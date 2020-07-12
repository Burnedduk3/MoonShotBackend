import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { UserRole } from '@entities/UserRole.entity';
import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import { jwtSign } from '@utils/jwt';
import * as bcrypt from 'bcrypt';
import faker from 'faker';
import { Connection } from 'typeorm';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const create: string = `
query(
  $userID: String!
  $phone: String!
  $firstName: String!
  $firstLastname: String!
  $username: String!
  $password: String!
  $email: String!
) {
  admin {
    User {
      crud {
        createUser(
          data: {
            userID: $userID
            phone: $phone
            firstName: $firstName
            firstLastname: $firstLastname
            username: $username
            password: $password
            email: $email
          }
        ) {
          error
          message
          data {
            username
            password
            confirmed
            firstName
          }
        }
      }
    }
  }
}

`;

const deleteUser: string = `
query($id: Float!) {
  admin {
    User {
      crud {
        deleteUser(id: $id) {
          error
          message
          data{
            id
          }
        }
      }
    }
  }
}

`;

const findById: string = `
query($id: Float!) {
  admin {
    User {
      crud {
        findUserById(id: $id) {
          error
          message
          data {
            username
            password
            confirmed
            firstName
            phone
            userID
          }
        }
      }
    }
  }
}
`;

const getAll: string = `
query {
  admin {
    User {
      crud {
        getAllUser {
          error
          message
          data {
            id
            firstName
            username
            password
          }
        }
      }
    }
  }
}
`;

const updateUser = `
query(
  $userID: String!
  $phone: String!
  $firstName: String!
  $firstLastname: String!
  $id:Float!
) {
  admin {
    User {
      crud {
        updateUser(
          id: $id
          data: {
            userID: $userID
            phone: $phone
            firstName: $firstName
            firstLastname: $firstLastname
          }
        ) {
          error
          message
          data {
            username
            password
            confirmed
            firstName
            phone
            userID
          }
        }
      }
    }
  }
}
`;

const updateUserRelations: string = `
query($id: Float! $action:String! $roleId:Float! $restaurantId:Float!, $reservationId:Float!) {
  admin {
    User {
      crud {
        updateUserRelations(
          id: $id
          action: $action
          data: {
            roleId: $roleId
            restaurantId: $restaurantId
            reservationId: $reservationId
          }
        ) {
          error
          message
          data {
            username
            restaurant{
              name
            }
            reservations{
              reservationIdentifier
            }
            role{
              name
            }
          }
        }
      }
    }
  }
}
`;

const fakeUser20 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.address.secondaryAddress(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.name.jobTitle(),
  password: faker.name.firstName(),
  email: faker.name.jobTitle(),
};

const fakeUser10 = {
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

const fakeUser11 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.hacker.verb(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.name.suffix(),
  password: faker.name.firstName(),
  email: faker.name.jobDescriptor(),
};

const fakeUser40 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.internet.email(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.hacker.adjective(),
  password: faker.name.firstName(),
  email: faker.name.jobArea(),
};

const fakeUser5 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.lorem.paragraph(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.company.companySuffix(),
  password: faker.name.firstName(),
  email: faker.name.title(),
};

const fakeUser6 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.name.lastName(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.lorem.word(),
  password: faker.name.firstName(),
  email: faker.commerce.color(),
};

const fakeUser7 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.phone.phoneNumber(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.lorem.lines(),
  password: faker.name.firstName(),
  email: faker.lorem.lines(),
};

const fakeUser8 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.address.country(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.hacker.adjective(),
  password: faker.name.firstName(),
  email: faker.name.prefix(),
};

describe('Admin User CRUD test', () => {
  it('should Create User', async () => {
    const accessToken = await jwtSign({
      username: fakeUser20.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: create,
      accessToken,
      variableValues: {
        ...fakeUser10,
      },
    });
    expect(response.data?.admin.User.crud.createUser.error).toBe(false);
    expect(response.data?.admin.User.crud.createUser.data.confirmed).toBeFalsy();
    expect(response.data?.admin.User.crud.createUser.data.firstName).toBe(fakeUser10.firstName);
    const result = await bcrypt.compare(fakeUser10.password, response.data?.admin.User.crud.createUser.data.password);
    expect(result).toBeTruthy();
  });

  it('should delete user', async () => {
    const accessToken = await jwtSign({
      username: fakeUser20.firstName,
      type: 'test',
      role: 'admin',
    });
    const user = await User.create({
      ...fakeUser5,
    }).save();
    if (!accessToken || !user) throw new Error('No access token');

    const response = await gCall({
      source: deleteUser,
      accessToken,
      variableValues: {
        id: user.id,
      },
    });
    expect(response.data?.admin.User.crud.deleteUser.error).toBe(false);
    expect(response.data?.admin.User.crud.deleteUser.message).toBeNull();
    expect(response.data?.admin.User.crud.deleteUser.data).toBeNull();
  });

  it('should Not delete user', async () => {
    const accessToken = await jwtSign({
      username: fakeUser20.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const response = await gCall({
      source: deleteUser,
      accessToken,
      variableValues: {
        id: Math.floor(Math.floor(2000) + Math.random()) + 200,
      },
    });
    expect(response.data?.admin.User.crud.deleteUser.error).toBe(true);
    expect(response.data?.admin.User.crud.deleteUser.message).toBeDefined();
    expect(response.data?.admin.User.crud.deleteUser.data).toBeNull();
  });

  it('should find user by id', async () => {
    const accessToken = await jwtSign({
      username: fakeUser20.firstName,
      type: 'test',
      role: 'admin',
    });
    const user = await User.create({
      ...fakeUser40,
    }).save();
    if (!accessToken || !user) throw new Error('No access token');

    const response = await gCall({
      source: findById,
      accessToken,
      variableValues: {
        id: user.id,
      },
    });
    expect(response.data?.admin.User.crud.findUserById.error).toBe(false);
    expect(response.data?.admin.User.crud.findUserById.message).toBeNull();
    expect(response.data?.admin.User.crud.findUserById.data).toBeDefined();
    expect(response.data?.admin.User.crud.findUserById.data.firstName).toBe(user.firstName);
    expect(response.data?.admin.User.crud.findUserById.data.username).toBe(user.username);
  });

  it('should Not find user by id', async () => {
    const accessToken = await jwtSign({
      username: fakeUser20.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const response = await gCall({
      source: findById,
      accessToken,
      variableValues: {
        id: Math.floor(Math.floor(2000) + Math.random()) + 200,
      },
    });
    expect(response.data?.admin.User.crud.findUserById.error).toBe(true);
    expect(response.data?.admin.User.crud.findUserById.message).toBeDefined();
    expect(response.data?.admin.User.crud.findUserById.data).toBeNull();
  });

  it('should find all users', async () => {
    const accessToken = await jwtSign({
      username: fakeUser20.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: getAll,
      accessToken,
    });

    expect(response.data?.admin.User.crud.getAllUser.error).toBe(false);
    expect(response.data?.admin.User.crud.getAllUser.message).toBeNull();
    expect(response.data?.admin.User.crud.getAllUser.data).toBeDefined();
  });

  it('should update user', async () => {
    const accessToken = await jwtSign({
      username: fakeUser20.firstName,
      type: 'test',
      role: 'admin',
    });
    const user = await User.create(fakeUser11).save();
    if (!accessToken || !user) throw new Error('No access token');
    const response = await gCall({
      source: updateUser,
      accessToken,
      variableValues: {
        id: user.id,
        userID: '132332123',
        phone: '+5714323122333123',
        firstName: 'jaun',
        firstLastname: 'ashda',
      },
    });

    expect(response.data?.admin.User.crud.updateUser.error).toBe(false);
    expect(response.data?.admin.User.crud.updateUser.message).toBeNull();
    expect(response.data?.admin.User.crud.updateUser.data).toBeDefined();
    expect(response.data?.admin.User.crud.updateUser.data.firstName).toBe('jaun');
    expect(response.data?.admin.User.crud.updateUser.data.userID).toBe('132332123');
    expect(response.data?.admin.User.crud.updateUser.data.phone).toBe('+5714323122333123');
  });

  it('should Not update user by id', async () => {
    const accessToken = await jwtSign({
      username: fakeUser20.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const response = await gCall({
      source: updateUser,
      accessToken,
      variableValues: {
        id: Math.floor(Math.floor(2000) + Math.random()) + 200,
        userID: '1323123',
        phone: '+571423123123',
        firstName: 'jaun',
        firstLastname: 'ashda',
      },
    });
    expect(response.data?.admin.User.crud.updateUser.error).toBe(true);
    expect(response.data?.admin.User.crud.updateUser.message).toBeDefined();
    expect(response.data?.admin.User.crud.updateUser.data).toBeNull();
  });

  it('should update User relations add', async () => {
    const accessToken = await jwtSign({
      username: fakeUser20.firstName,
      type: 'test',
      role: 'admin',
    });
    const restaurant = await Restaurant.create({
      name: 'tes23t',
      address: 'asfddasd',
      phoneNumber: '1231212332',
      maxCapacity: 200,
    }).save();
    const user = await User.create({ ...fakeUser6 }).save();
    const role = await UserRole.create({
      name: 'sdzgasdggsdfgsdf',
    }).save();
    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: '2020-07-30 14:38:54.85',
    }).save();
    if (!accessToken || !restaurant || !user || !role || !reservation) throw new Error('No access token');
    const response = await gCall({
      source: updateUserRelations,
      accessToken,
      variableValues: {
        id: user.id,
        action: 'add',
        restaurantId: restaurant.id,
        roleId: role.id,
        reservationId: reservation.id,
      },
    });
    expect(response.data?.admin.User.crud.updateUserRelations.error).toBe(false);
    expect(response.data?.admin.User.crud.updateUserRelations.message).toBeNull();
    expect(response.data?.admin.User.crud.updateUserRelations.data).toBeDefined();
    expect(response.data?.admin.User.crud.updateUserRelations.data.username).toBe(user.username);
    expect(response.data?.admin.User.crud.updateUserRelations.data.role.name).toBe(role.name);
    expect(response.data?.admin.User.crud.updateUserRelations.data.restaurant).toBeDefined();
    expect(response.data?.admin.User.crud.updateUserRelations.data.reservations).toBeDefined();
  });

  it('should update User relations delete', async () => {
    const accessToken = await jwtSign({
      username: fakeUser20.firstName,
      type: 'test',
      role: 'admin',
    });
    const user = await User.create({ ...fakeUser7 }).save();
    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: '2020-07-30 14:38:54.85',
    }).save();
    await conn.createQueryBuilder().relation(User, 'reservations').of(user).add(reservation);
    if (!accessToken || !user || !reservation) throw new Error('No access token');
    const response = await gCall({
      source: updateUserRelations,
      accessToken,
      variableValues: {
        id: user.id,
        action: 'delete',
        restaurantId: 1,
        reservationId: reservation.id,
        roleId: 1,
      },
    });
    expect(response.data?.admin.User.crud.updateUserRelations.error).toBe(false);
    expect(response.data?.admin.User.crud.updateUserRelations.message).toBeNull();
    expect(response.data?.admin.User.crud.updateUserRelations.data).toBeDefined();
    expect(response.data?.admin.User.crud.updateUserRelations.data.restaurant).toBeDefined();
    expect(response.data?.admin.User.crud.updateUserRelations.data.reservations).toBeDefined();
  });

  it('should Not update User relations', async () => {
    const accessToken = await jwtSign({
      username: fakeUser20.firstName,
      type: 'test',
      role: 'admin',
    });
    const user = await User.create({ ...fakeUser8 }).save();
    const restaurant = await Restaurant.create({
      name: 'test',
      address: 'asdasd',
      phoneNumber: '12312332',
      maxCapacity: 200,
    }).save();
    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: '2020-07-30 14:38:54.85',
    }).save();
    if (!accessToken || !user || !reservation || !restaurant) throw new Error('No access token');
    const response = await gCall({
      source: updateUserRelations,
      accessToken,
      variableValues: {
        id: Math.floor(Math.floor(2000) + Math.random()) + 200,
        action: 'delete',
        restaurantId: restaurant.id,
        reservationId: reservation.id,
        roleId: 1,
      },
    });
    expect(response.data?.admin.User.crud.updateUserRelations.error).toBe(true);
    expect(response.data?.admin.User.crud.updateUserRelations.message).toBeDefined();
    expect(response.data?.admin.User.crud.updateUserRelations.data).toBeNull();
  });
});
