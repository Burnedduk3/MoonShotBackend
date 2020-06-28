// import { BusinessTypes } from '@entities/BusinessTypes.entity';
// import { gCall } from '@test/gCall';
// import { testConn } from '@test/testCon';
// import { jwtSign } from '@utils/jwt';
// import faker from 'faker';
// import { Connection } from 'typeorm';
//
// let conn: Connection;
//
// beforeAll(async () => {
//   conn = await testConn();
// });
//
// afterAll(async () => {
//   await conn.close();
// });
//
// const meQuery = `query MeQuery{
//     user{
//       me{
//         phone
//       }
//     }
//   }`;
// const fakeUser = {
//   phone: faker.phone.phoneNumber(),
//   firstName: faker.name.firstName(),
//   secondName: faker.name.firstName(),
//   firstLastname: faker.name.lastName(),
//   secondLastname: faker.name.lastName(),
//   confirmed: true,
// };
// describe('user/BusinessResolver', () => {
//   it('should get userInformation', async () => {
//     let user = await BusinessTypes.findOne({ phone: fakeUser.phone });
//     if (!user) {
//       user = await BusinessTypes.create({ ...fakeUser }).save();
//     }
//     const token = await jwtSign({
//       phone: fakeUser.phone,
//       type: 'test',
//       role: 'lawyer',
//     });
//     if (token === false) throw new Error('error creating token');
//     const response = await gCall({
//       source: meQuery,
//       accessToken: token,
//     });
//     if (!response.data) throw new Error(`${JSON.stringify(response.errors)}`);
//     expect(response.data.user.me.phone).toBe(fakeUser.phone);
//   });
//   it('should not find user', async () => {
//     const token = await jwtSign({
//       phone: 'wrong number',
//       type: 'test',
//       role: 'admin',
//     });
//     if (token === false) throw new Error('error creating token');
//     const response = await gCall({
//       source: meQuery,
//       accessToken: token,
//     });
//     expect(response.data?.user.me).toBe(null);
//   });
// });
