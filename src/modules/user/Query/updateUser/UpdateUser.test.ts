// import { UserTypes } from '@entities/UserTypes.entity';
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
// const updateUserQuery = `query UpdateUser(
//     $firstName: String
//     $secondName: String
//     $firstLastname: String
//     $secondLastname: String
//   ) {
//     user {
//       updateUser(
//         data: {
//           firstName: $firstName
//           secondName: $secondName
//           firstLastname: $firstLastname
//           secondLastname: $secondLastname
//         }
//       ) {
//         error
//         message
//         user {
//           phone
//           firstName
//           secondName
//           firstLastname
//           secondLastname
//         }
//       }
//     }
//   }
//   `;
//
// const fakeUser = {
//   phone: faker.phone.phoneNumber(),
//   firstName: faker.name.firstName(),
//   secondName: faker.name.firstName(),
//   firstLastname: faker.name.lastName(),
//   secondLastname: faker.name.lastName(),
//   confirmed: true,
// };
//
// describe('user/UpdateUser', () => {
//   it('should return same user', async () => {
//     let user = await UserTypes.findOne(
//       {
//         phone: fakeUser.phone,
//       },
//       { relations: ['role'] },
//     );
//     if (!user) {
//       user = await UserTypes.create({
//         ...fakeUser,
//       }).save();
//     }
//     const accessToken = await jwtSign({
//       phone: fakeUser.phone,
//       type: 'test',
//       role: 'lawyer',
//     });
//     if (accessToken === false) throw new Error('error creating token');
//     const response = await gCall({
//       source: updateUserQuery,
//       accessToken,
//     });
//     if (!response.data) throw new Error(`${JSON.stringify(response.errors)}`);
//     expect(response.data.user.updateUser.error).toBe(false);
//     expect(response.data.user.updateUser.user.phone).toBe(fakeUser.phone);
//   });
//   it('should update user', async () => {
//     const accessToken = await jwtSign({
//       phone: fakeUser.phone,
//       type: 'test',
//       role: 'lawyer',
//     });
//     if (accessToken === false) throw new Error('error creating token');
//     let user = await UserTypes.findOne(
//       {
//         phone: fakeUser.phone,
//       },
//       { relations: ['role'] },
//     );
//     if (!user) {
//       user = await UserTypes.create({
//         ...fakeUser,
//       }).save();
//     }
//
//     const updateFields = {
//       firstName: 'neFirstName',
//       secondName: 'new',
//       firstLastname: 'new',
//       secondLastname: 'new',
//     };
//     const response = await gCall({
//       source: updateUserQuery,
//       accessToken,
//       variableValues: { ...updateFields },
//     });
//     if (!response.data) throw new Error(`${JSON.stringify(response.errors)}`);
//     expect(response.data.user.updateUser.error).toBe(false);
//     expect(response.data.user.updateUser.user.firstName).toBe(updateFields.firstName);
//     expect(response.data.user.updateUser.user.secondName).toBe(updateFields.secondName);
//     expect(response.data.user.updateUser.user.firstLastname).toBe(updateFields.firstLastname);
//     expect(response.data.user.updateUser.user.secondLastname).toBe(updateFields.secondLastname);
//   });
//
//   it('should failed Update user by wrong phone', async () => {
//     const accessToken = await jwtSign({
//       phone: 'wrongPhone',
//       type: 'test',
//       role: 'lawyer',
//     });
//     if (accessToken === false) throw new Error('error creating token');
//
//     const response = await gCall({
//       source: updateUserQuery,
//       accessToken,
//     });
//
//     if (!response.data) throw new Error(`${JSON.stringify(response.errors)}`);
//     expect(response.data.user.updateUser.error).toBe(true);
//     expect(response.data.user.updateUser.message).toBe('no user');
//   });
// });
