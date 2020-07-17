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
    const response = await gCall({
      source: loginUserPassword,
      variableValues: {
        username: 'JuanCabDu',
        password: 'AdminPassword',
      },
    });
    expect(response.data?.auth.login.loginWithUsernameAndPassword.error).toBeFalsy();
    expect(response.data?.auth.login.loginWithUsernameAndPassword.data.accessToken).toBeDefined();
    expect(response.data?.auth.login.loginWithUsernameAndPassword.data.refreshToken).toBeDefined();
    expect(response.data?.auth.login.loginWithUsernameAndPassword.message).toBeNull();
    expect(response.data?.auth.login.loginWithUsernameAndPassword.user).toBeDefined();
    expect(response.data?.auth.login.loginWithUsernameAndPassword.user.username).toBe('JuanCabDu');
    expect(response.data?.auth.login.loginWithUsernameAndPassword.user.phone).toBe('+573167404216');
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
