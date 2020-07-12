import { User } from '@entities/User.entity';
import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import { Connection } from 'typeorm';

let conn: Connection;

beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const loginUserPassword = `
query(
  $username: String!
  $password: String!
) {
  auth{
    login{
      loginWithUsernameAndPassword(data:{username:$username,password:$password}){
        error
        data{
          accessToken
          refreshToken
        }
        message
        user{
          id
          username
          password
          phone
        }
      }
    }
  }
}
`;

describe('Test Login Auth resolver', () => {
  it('should Login user', async () => {
    const user = await User.findOne({ phone: '+573167404216' });
    if (!user) throw new Error('Could not create user');
    const response = await gCall({
      source: loginUserPassword,
      variableValues: {
        username: user.username,
        password: user.password,
      },
    });
    expect(response.data?.auth.login.loginWithUsernameAndPassword.error).toBeFalsy();
    expect(response.data?.auth.login.loginWithUsernameAndPassword.data.accessToken).toBeDefined();
    expect(response.data?.auth.login.loginWithUsernameAndPassword.data.refreshToken).toBeDefined();
    expect(response.data?.auth.login.loginWithUsernameAndPassword.message).toBeNull();
    expect(response.data?.auth.login.loginWithUsernameAndPassword.user).toBeDefined();
    expect(response.data?.auth.login.loginWithUsernameAndPassword.user.username).toBe(user.username);
    expect(response.data?.auth.login.loginWithUsernameAndPassword.user.phone).toBe(user.phone);
  });

  it('should Not Login user', async () => {
    const response = await gCall({
      source: loginUserPassword,
      variableValues: {
        username: 'jklhbdfgsjkdfhsbgdsfgkjh',
        password: 'klj;hjglkjshfgjksdfg',
      },
    });
    expect(response.data?.auth.login.loginWithUsernameAndPassword.error).toBeTruthy();
    expect(response.data?.auth.login.loginWithUsernameAndPassword.data).toBeNull;
    expect(response.data?.auth.login.loginWithUsernameAndPassword.message).toBeDefined();
  });
});
