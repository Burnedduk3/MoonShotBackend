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

const fakeUser = {
  phone: faker.phone.phoneNumber(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  confirmed: true,
  confirmationCode: 123123,
};
