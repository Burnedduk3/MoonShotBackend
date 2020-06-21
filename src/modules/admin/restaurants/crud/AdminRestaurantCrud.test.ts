// import { UserRole } from '@entities/UserRole.entity';
// import { gCall } from '@test/gCall';
// import { testConn } from '@test/testCon';
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
// const create = `
// query($data:CrudCreateUserRoleInputs!){
//   admin{
//     UserRole{
//       crud{
//         createUserRole(data:$data){
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
// const findOne = `
// query($id:Float!){
//   admin{
//     UserRole{
//       crud{
//         findUserRoleById(id:$id){
//           error
//           data{
//             id
//             name
//             users{
//               id
//             }
//           }
//           message
//         }
//       }
//     }
//   }
// }
// `;
//
// const deleteUserRole = `
//   query($id:Float!){
//   admin{
//     UserRole{
//       crud{
//         deleteUserRole(id:$id){
//         \terror
//           message
//
//         }
//       }
//     }
//   }
// }
// `;
//
// const findAll = `
// query{
//   admin{
//     UserRole{
//       crud{
//         getAllUserRole{
//           error
//           message
//           data{
//             id
//             name
//           }
//         }
//       }
//     }
//   }
// }
// `;
//
// describe('Test admin user Role CRUD resolver', () => {
//   it('Should Create user Role', async () => {
//     const response = await gCall({
//       source: create,
//       variableValues: {
//         data: {
//           name: 'hwerh',
//         },
//       },
//     });
//     expect(response.data?.admin.UserRole.crud.createUserRole.data.id).toBeDefined();
//     expect(response.data?.admin.UserRole.crud.createUserRole.data.name).toBeDefined();
//     expect(response.data?.admin.UserRole.crud.createUserRole.data.name).toBe('hwerh');
//     expect(response.data?.admin.UserRole.crud.createUserRole.error).toBeFalsy();
//   });
//
//   it('Should Find One user Role', async () => {
//     const userRole = await UserRole.create({ name: 'dfg' }).save();
//     const response = await gCall({
//       source: findOne,
//       variableValues: {
//         id: userRole.id,
//       },
//     });
//     expect(response.data?.admin.UserRole.crud.findUserRoleById.data.id).toBe(userRole.id.toString());
//     expect(response.data?.admin.UserRole.crud.findUserRoleById.data.name).toBe(userRole.name);
//     expect(response.data?.admin.UserRole.crud.findUserRoleById.error).toBeFalsy();
//   });
//
//   it('Should NOT Find One user Role', async () => {
//     const response = await gCall({
//       source: findOne,
//       variableValues: {
//         id: 100,
//       },
//     });
//     expect(response.data?.admin.UserRole.crud.findUserRoleById.data).toBeNull();
//     expect(response.data?.admin.UserRole.crud.findUserRoleById.error).toBeTruthy();
//     expect(response.data?.admin.UserRole.crud.findUserRoleById.message).toBeDefined();
//   });
//
//   it('Should Find All user Roles', async () => {
//     const response = await gCall({
//       source: findAll,
//     });
//     expect(response.data?.admin.UserRole.crud.getAllUserRole.data).toBeDefined();
//     expect(response.data?.admin.UserRole.crud.getAllUserRole.error).toBeFalsy();
//   });
//
//   it('Should Delete user Role', async () => {
//     const userRole = await UserRole.create({ name: 'dfhgsdfhgsdfh' }).save();
//     const response = await gCall({
//       source: deleteUserRole,
//       variableValues: {
//         id: userRole.id,
//       },
//     });
//     expect(response.data?.admin.UserRole.crud.deleteUserRole.error).toBeFalsy();
//   });
// });
