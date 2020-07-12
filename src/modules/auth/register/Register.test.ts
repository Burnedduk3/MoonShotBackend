import { User } from '@entities/User.entity';
import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import faker from 'faker';
import { Connection } from 'typeorm';

let conn: Connection;

beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const registerUserPassword = `
query(
  $username: String!
  $password: String!
  $phone: String!
  $userID: String!
  $email: String!
  $firstName: String!
  $firstLastname: String!
  $role: String!
) {
  auth {
    register {
      register(
        data: {
          username: $username
          password: $password
          phone: $phone
          userID: $userID
          email: $email
          firstName: $firstName
          firstLastname: $firstLastname
          role: $role
        }
      ) {
        error
        message
      }
    }
  }
}
`;

const fakeUser = {
  phone: faker.internet.ip(),
  userID: faker.database.column(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.internet.ipv6(),
  password: faker.name.firstName(),
  email: faker.hacker.noun(),
};

describe('Test Register Auth resolver', () => {
  it('should register User with user role', async () => {
    const response = await gCall({
      source: registerUserPassword,
      variableValues: {
        ...fakeUser,
        role: 'business',
      },
    });
    expect(response.data?.auth.register.register.error).toBeFalsy();
    expect(response.data?.auth.register.register.message).toBe('User Created');
    const user = await User.findOne({ username: fakeUser.username });
    expect(user).toBeDefined();
    expect(user?.phone).toBe(fakeUser.phone);
    expect(user?.email).toBe(fakeUser.email);
    expect(user?.username).toBe(fakeUser.username);
  });

  it('should Not register User with user role', async () => {
    const response = await gCall({
      source: registerUserPassword,
      variableValues: {
        ...fakeUser,
        role: 'admin',
      },
    });
    expect(response.data?.auth.register.register.error).toBeTruthy();
    expect(response.data?.auth.register.register.message).toBeDefined();
  });

  it('should Not register User with wrong phone', async () => {
    const response = await gCall({
      source: registerUserPassword,
      variableValues: {
        phone: fakeUser.phone,
        userID: 'sdjkhfkjashdf',
        firstName: faker.name.firstName(),
        secondName: faker.name.firstName(),
        firstLastname: faker.name.lastName(),
        secondLastname: faker.name.lastName(),
        username: 'sasdhjk',
        password: faker.name.firstName(),
        email: 'kjhfjsdahf22333',
        role: 'user',
      },
    });
    expect(response.data?.auth.register.register.error).toBeTruthy();
    expect(response.data?.auth.register.register.message).toBeDefined();
  });

  it('should Not register User with wrong username', async () => {
    const response = await gCall({
      source: registerUserPassword,
      variableValues: {
        phone: '12312312412',
        userID: 'sdjkhfkjashdf',
        firstName: faker.name.firstName(),
        secondName: faker.name.firstName(),
        firstLastname: faker.name.lastName(),
        secondLastname: faker.name.lastName(),
        username: fakeUser.username,
        password: faker.name.firstName(),
        email: 'kjhfjsdahf22333',
        role: 'user',
      },
    });
    expect(response.data?.auth.register.register.error).toBeTruthy();
    expect(response.data?.auth.register.register.message).toBeDefined();
  });

  it('should Not register User with wrong userId', async () => {
    const response = await gCall({
      source: registerUserPassword,
      variableValues: {
        phone: '12312312412',
        userID: fakeUser.userID,
        firstName: faker.name.firstName(),
        secondName: faker.name.firstName(),
        firstLastname: faker.name.lastName(),
        secondLastname: faker.name.lastName(),
        username: 'fakeUser.username',
        password: faker.name.firstName(),
        email: 'kjhfjsdahf22333',
        role: 'user',
      },
    });
    expect(response.data?.auth.register.register.error).toBeTruthy();
    expect(response.data?.auth.register.register.message).toBeDefined();
  });

  it('should Not register User with wrong mail', async () => {
    const response = await gCall({
      source: registerUserPassword,
      variableValues: {
        phone: '12312312412',
        userID: 'fakeUser.userID',
        firstName: faker.name.firstName(),
        secondName: faker.name.firstName(),
        firstLastname: faker.name.lastName(),
        secondLastname: faker.name.lastName(),
        username: 'fakeUser.username',
        password: faker.name.firstName(),
        email: fakeUser.email,
        role: 'user',
      },
    });
    expect(response.data?.auth.register.register.error).toBeTruthy();
    expect(response.data?.auth.register.register.message).toBeDefined();
  });
});
