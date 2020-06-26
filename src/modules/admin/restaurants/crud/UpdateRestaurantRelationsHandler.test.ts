// import { BusinessTypes } from '@entities/BusinessTypes.entity';
// import { UserRole } from '@entities/UserRole.entity';
// import { gCall } from '@test/gCall';
// import { testConn } from '@test/testCon';
// import faker from 'faker';
// import { Connection, getConnection } from 'typeorm';
//
// let conn: Connection;
//
// beforeAll(async () => {
//   conn = await testConn();
//   jest.mock('@services/Redis', () => ({
//     redisSetRefreshTokenInDB: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
//     redisCheckIfTokenExist: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
//   }));
// });
//
// afterAll(async () => {
//   await conn.close();
// });
//
// const query = `
// query($id:Float!, $data:CrudUserRoleUpdateRelationsInputs!, $action:String!){
//   admin{
//     UserRole{
//       crud{
//         updateUserRoleRelations(id:$id, data:$data, action:$action){
//           error
//           message
//           data{
//             id
//             name
//             users{
//               id
//             }
//           }
//         }
//       }
//     }
//   }
// }
// `;
//
// const fakeUser = {
//   phone: faker.phone.phoneNumber(),
//   firstName: faker.name.firstName(),
//   secondName: faker.name.firstName(),
//   firstLastname: faker.name.lastName(),
//   secondLastname: faker.name.lastName(),
//   confirmed: true,
//   confirmationCode: 123123,
// };
//
// const fakeUser2 = {
//   phone: faker.phone.phoneNumber(),
//   firstName: faker.name.firstName(),
//   secondName: faker.name.firstName(),
//   firstLastname: faker.name.lastName(),
//   secondLastname: faker.name.lastName(),
//   confirmed: true,
//   confirmationCode: 123123,
// };
//
// const fakeUser3 = {
//   phone: faker.phone.phoneNumber(),
//   firstName: faker.name.firstName(),
//   secondName: faker.name.firstName(),
//   firstLastname: faker.name.lastName(),
//   secondLastname: faker.name.lastName(),
//   confirmed: true,
//   confirmationCode: 123123,
// };
//
// const fakeUser4 = {
//   phone: faker.phone.phoneNumber(),
//   firstName: faker.name.firstName(),
//   secondName: faker.name.firstName(),
//   firstLastname: faker.name.lastName(),
//   secondLastname: faker.name.lastName(),
//   confirmed: true,
//   confirmationCode: 123123,
// };
//
// describe('UpdateMenu user Role Relations', () => {
//   it('Should update user Role Relations', async () => {
//     let userRole: UserRole | undefined = await UserRole.create({ name: faker.name.firstName() }).save();
//     const user = await BusinessTypes.create({ ...fakeUser }).save();
//     const response = await gCall({
//       source: query,
//       variableValues: {
//         id: userRole.id,
//         data: { user: user.id },
//         action: 'add',
//       },
//     });
//
//     userRole = await UserRole.findOne(response.data?.admin.UserRole.crud.updateUserRoleRelations.id, {
//       relations: ['users'],
//     });
//     if (userRole) {
//       expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.data.users[0].id).toBe(user.id.toString());
//       expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.error).toBeFalsy();
//     }
//   });
//
//   it('Should NOT update user role', async () => {
//     const user = await BusinessTypes.create({ ...fakeUser2 }).save();
//     const response = await gCall({
//       source: query,
//       variableValues: {
//         id: 100,
//         data: { user: user.id },
//         action: 'add',
//       },
//     });
//     expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.error).toBeTruthy();
//     expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.message).toBeDefined();
//   });
//
//   it('Should Delete user Role Relations', async () => {
//     const userRole: UserRole = await UserRole.create({ name: faker.name.firstName() }).save();
//     const user = await BusinessTypes.create({ ...fakeUser3 }).save();
//     await getConnection().createQueryBuilder().relation(UserRole, 'users').of(userRole).add(user);
//     const response = await gCall({
//       source: query,
//       variableValues: {
//         id: userRole.id,
//         data: { user: user.id },
//         action: 'delete',
//       },
//     });
//
//     expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.data.users).toEqual([]);
//     expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.error).toBeFalsy();
//   });
//
//   it('Should Not Delete user Role Relations', async () => {
//     const userRole: UserRole = await UserRole.create({ name: faker.name.firstName() }).save();
//     const user = await BusinessTypes.create({ ...fakeUser4 }).save();
//     await getConnection().createQueryBuilder().relation(UserRole, 'users').of(userRole).add(user);
//     const response = await gCall({
//       source: query,
//       variableValues: {
//         id: 100,
//         data: { user: user.id },
//         action: 'delete',
//       },
//     });
//
//     expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.message).toBeDefined();
//     expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.error).toBeTruthy();
//   });
// });
