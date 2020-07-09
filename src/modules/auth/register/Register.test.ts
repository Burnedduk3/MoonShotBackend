import { User } from '@entities/User.entity';
import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import faker from 'faker';
import { Connection } from 'typeorm/connection/Connection';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
  jest.mock('@services/Twilio', () => ({
    sendTwilioMessage: jest.fn(() => ({ error: false })),
  }));
});
afterAll(async () => {
  conn.close();
});
const fakeUser = {
  phone: faker.phone.phoneNumber('+57##########'),
  role: 'lawyer',
};

const registerQuery = `query RegisterWithPhone($phone:String!, $role:String!){
    auth{
      register{
        registerWithPhone(data:{phone:$phone,role:$role}){
          error
          message
        }
      }
    }
  }`;

describe('Auth/RegisterResolver', () => {
  it('should register correctly', async () => {
    const response = await gCall({
      source: registerQuery,
      variableValues: {
        ...fakeUser,
      },
    });
    expect(response.data?.auth.register.registerWithPhone.error).toBe(false); // ?
  });

  it('should failed by role', async () => {
    const response = await gCall({
      source: registerQuery,
      variableValues: {
        phone: fakeUser.phone,
        role: 'error Role',
      },
    });
    expect(response.data?.auth.register.registerWithPhone.error).toBe(true);
    expect(response.data?.auth.register.registerWithPhone.message).toBe('no role provided');
  });
  it('Should failed with user exist', async () => {
    const fakeUser1 = {
      phone: faker.phone.phoneNumber(),
      firstName: faker.name.firstName(),
      secondName: faker.name.firstName(),
      firstLastname: faker.name.lastName(),
      secondLastname: faker.name.lastName(),
      confirmed: true,
    };
    let user = await User.findOne({ phone: fakeUser1.phone });
    if (!user) {
      user = await User.create({
        ...fakeUser1,
      }).save();
    }
    const response = await gCall({
      source: registerQuery,
      variableValues: {
        phone: fakeUser1.phone,
        role: 'business',
      },
    });
    expect(response.data?.auth.register.registerWithPhone.error).toBe(true);
    expect(response.data?.auth.register.registerWithPhone.message).toBe('User already exist');
  });
});
