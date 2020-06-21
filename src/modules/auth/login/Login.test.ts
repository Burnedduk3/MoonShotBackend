import { User } from '@entities/User.entity';
import { UserRole } from '@entities/UserRole.entity';
import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import faker from 'faker';
import { Connection, getConnection } from 'typeorm';

// import { gCall } from "@test/gCall";

let conn: Connection;

beforeAll(async () => {
  conn = await testConn();
  jest.mock('@services/Twilio', () => ({
    sendTwilioMessage: jest
      .fn()
      .mockReturnValueOnce({ error: false, message: 'asdasasd' })
      .mockReturnValueOnce({ error: true, message: 'mockedMessage' }),
  }));
  jest.mock('@services/Redis', () => ({
    redisSetRefreshTokenInDB: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
  }));
});

afterAll(async () => {
  await conn.close();
});

const loginMutation = `
query LoginWithPhone($phone: String!) {
  auth {
    login {
      loginWithPhone(data: { phone: $phone }) {
        error
        message
      }
    }
  }
}
`;
const checkCodeQuery = `
query CheckCode($phone: String!, $code: Float!) {
  auth {
    login {
      checkCode(data: { phone: $phone, code: $code }) {
        error
        data {
          accessToken
          refreshToken
        }
        message
      }
    }
  }
}
`;

const fakeUser = {
  phone: faker.phone.phoneNumber(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  confirmed: true,
  confirmationCode: 123123,
};

describe('Auth/LoginResolver', () => {
  it('LoginUser with phone success', async () => {
    let adminRole = await UserRole.findOne({ name: 'lawyer' });

    if (!adminRole) {
      adminRole = await UserRole.create({ name: 'lawyer' }).save();
    }
    let user = await User.findOne(
      {
        phone: fakeUser.phone,
      },
      { relations: ['role'] },
    );
    if (!user) {
      user = await User.create({
        ...fakeUser,
      }).save();
      await getConnection().createQueryBuilder().relation(User, 'role').of(user).set(adminRole);
    }
    const response = await gCall({
      source: loginMutation,
      variableValues: {
        phone: fakeUser.phone,
      },
    });
    expect(response.data?.auth.login.loginWithPhone.error).toBe(false);
  });

  it('should fail sending message', async () => {
    let adminRole = await UserRole.findOne({ name: 'lawyer' });

    if (!adminRole) {
      adminRole = await UserRole.create({ name: 'lawyer' }).save();
    }
    let user = await User.findOne(
      {
        phone: fakeUser.phone,
      },
      { relations: ['role'] },
    );
    if (!user) {
      user = await User.create({
        ...fakeUser,
      }).save();
      await getConnection().createQueryBuilder().relation(User, 'role').of(user).set(adminRole);
    }
    const response = await gCall({
      source: loginMutation,
      variableValues: {
        phone: fakeUser.phone,
      },
    });
    expect(response.data?.auth.login.loginWithPhone.error).toBe(true);
  });

  it('should not find user', async () => {
    const wrongPhone = 'wrongPhone';
    const response = await gCall({
      source: loginMutation,
      variableValues: {
        phone: wrongPhone,
      },
    });
    expect(response.data?.auth.login.loginWithPhone.error).toBe(true);
    expect(response.data?.auth.login.loginWithPhone.message).toBe('User not exist');
  });

  // Check code
});

describe('Auth/LoginResolver/checkCode', () => {
  it('should check code success', async () => {
    let adminRole = await UserRole.findOne({ name: 'lawyer' });

    if (!adminRole) {
      adminRole = await UserRole.create({ name: 'lawyer' }).save();
    }
    let user = await User.findOne(
      {
        phone: fakeUser.phone,
      },
      { relations: ['role'] },
    );
    if (!user) {
      user = await User.create({
        ...fakeUser,
      }).save();
      await getConnection().createQueryBuilder().relation(User, 'role').of(user).set(adminRole);
    }
    const response = await gCall({
      source: checkCodeQuery,
      variableValues: {
        phone: fakeUser.phone,
        code: fakeUser.confirmationCode,
      },
    });
    expect(response.data?.auth.login.checkCode.error).toBe(false);
  });
  it('should not find the user', async () => {
    const response = await gCall({
      source: checkCodeQuery,
      variableValues: {
        phone: 'wrongPhone',
        code: fakeUser.confirmationCode,
      },
    });
    expect(response.data?.auth.login.checkCode.error).toBe(true);
    expect(response.data?.auth.login.checkCode.message).toBe('User not exist');
  });
  it('should not fail verification code', async () => {
    let adminRole = await UserRole.findOne({ name: 'lawyer' });

    if (!adminRole) {
      adminRole = await UserRole.create({ name: 'lawyer' }).save();
    }
    let user = await User.findOne(
      {
        phone: fakeUser.phone,
      },
      { relations: ['role'] },
    );
    if (!user) {
      user = await User.create({
        ...fakeUser,
      }).save();
      await getConnection().createQueryBuilder().relation(User, 'role').of(user).set(adminRole);
    }
    const response = await gCall({
      source: checkCodeQuery,
      variableValues: {
        phone: fakeUser.phone,
        code: 44122,
      },
    });
    expect(response.data?.auth.login.checkCode.error).toBe(true);
    expect(response.data?.auth.login.checkCode.message).toBe('Wrong verification code');
  });
});
