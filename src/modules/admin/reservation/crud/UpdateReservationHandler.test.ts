// import { UserRole } from '@entities/UserRole.entity';
// import { gCall } from '@test/gCall';
// import { testConn } from '@test/testCon';
// import faker from 'faker';
// import { Connection } from 'typeorm';
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
// query($id:Float!, $data:CrudUserRoleUpdateInput!){
//   admin{
//     UserRole{
//       crud{
//         updateUserRole(id:$id,data:$data){
//           error
//           data{
//             id
//             name
//           }
//           message
//         }
//       }
//     }
//   }
// }
// `;
//
// describe('Update user Role', () => {
//   it('Should update user Role', async () => {
//     let userRole: UserRole | undefined = await UserRole.create({ name: faker.name.firstName() }).save();
//     const response = await gCall({
//       source: query,
//       variableValues: {
//         id: userRole.id,
//         data: { name: 'sdfsddggg' },
//       },
//     });
//
//     userRole = await UserRole.findOne(response.data?.admin.UserRole.crud.updateUserRole.data.id);
//     if (userRole) {
//       expect(response.data?.admin.UserRole.crud.updateUserRole.data.name).toBe('sdfsddggg');
//       expect(response.data?.admin.UserRole.crud.updateUserRole.error).toBeFalsy();
//     }
//   });
//
//   it('Should NOT update user Role', async () => {
//     const response = await gCall({
//       source: query,
//       variableValues: {
//         id: 100,
//         data: { name: 'test' },
//       },
//     });
//     expect(response.data?.admin.UserRole.crud.updateUserRole.error).toBeTruthy();
//     expect(response.data?.admin.UserRole.crud.updateUserRole.message).toBeDefined();
//   });
// });
