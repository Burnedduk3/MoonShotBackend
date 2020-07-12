import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import { jwtSign } from '@utils/jwt';
import faker from 'faker';
import { Connection } from 'typeorm';

let conn: Connection;

beforeAll(async () => {
  conn = await testConn();
  jest.mock('@services/Redis', () => ({
    redisSetRefreshTokenInDB: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
    redisCheckIfTokenExist: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
  }));
});

afterAll(async () => {
  conn.close();
});

const query = `
query RefreshToken($token: String!) {
    refreshToken(data: { refreshToken: $token }) {
      error
      message
      data {
        accessToken
        refreshToken
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
describe('Refresh token Handler', () => {
  it('should refresh token success', async () => {
    const refreshToken = await jwtSign({
      type: 'refresh',
      username: fakeUser.firstName,
      role: 'business',
      version: 'asdasdasdasdasd',
    });
    const response = await gCall({
      source: query,
      variableValues: {
        token: refreshToken,
      },
    });
    expect(response.data?.refreshToken.error).toBe(false);
  });
  it('should refresh token failed', async () => {
    const refreshToken = await jwtSign({
      type: 'refresh',
      username: "asdfasdfaaa",
      role: 'user',
      version: 'asdasdasdasdasd',
    });
    const response = await gCall({
      source: query,
      variableValues: {
        token: refreshToken,
      },
    });
    expect(response.data?.refreshToken.error).toBe(true);
    expect(response.data?.refreshToken.message).toBe('No token in DB');
  });
});
