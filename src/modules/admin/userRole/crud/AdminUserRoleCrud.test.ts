import { User } from '@entities/User.entity';
import { UserRole } from '@entities/UserRole.entity';
import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import { jwtSign } from '@utils/jwt';
import * as faker from 'faker';
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
  await conn.close();
});

const create = `
query($data:CrudCreateUserRoleInputs!){
  admin{
    UserRole{
      crud{
        createUserRole(data:$data){
          error
          data{
            id
            name
          }
          message
        }
      }
    }
  }
}
`;

const findOne = `
query($id: Float!) {
  admin {
    UserRole {
      crud {
        findUserRoleById(id: $id) {
          error
          message
          data {
            id
            name
          }
        }
      }
    }
  }
}
`;

const deleteUserRole = `
query($id:Float!){
  admin{
    UserRole{
      crud{
        deleteUserRole(id:$id){
          error
          message
          
        }
      }
    }
  }
}
`;

const findAll = `
query{
  admin{
    UserRole{
      crud{
        getAllUserRole{
          error
          message
          data{
            id
            name
          }
        }
      }
    }
  }
}
`;

const updateUserRole = `
query($id:Float!, $data:CrudUserRoleUpdateInput!){
  admin{
    UserRole{
      crud{
        updateUserRole(id:$id,data:$data){
          error
          data{
            id
            name
          }
          message
        }
      }
    }
  }
}
`;

const updateRelations = `
query($id:Float!, $data:CrudUserRoleUpdateRelationsInputs!, $action:String!){
  admin{
    UserRole{
      crud{
        updateUserRoleRelations(id:$id, data:$data, action:$action){
          error
          message
          data{
            id
            name
            users{
              id
            }
          }
        }
      }
    }
  }
}
`;

const fakeUser = {
  phone: faker.phone.phoneNumber(),
  userID: faker.name.lastName(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.finance.bitcoinAddress(),
  password: faker.name.firstName(),
  email: faker.finance.bitcoinAddress(),
};

const fakeUser2 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.name.lastName(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.finance.bitcoinAddress(),
  password: faker.name.firstName(),
  email: faker.finance.bitcoinAddress(),
};

const fakeUser3 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.name.lastName(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.hacker.verb(),
  password: faker.hacker.ingverb(),
  email: faker.lorem.sentence(),
};

const fakeUser4 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.name.lastName(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.internet.mac(),
  password: faker.name.firstName(),
  email: faker.phone.phoneNumberFormat(),
};

describe('Test Admin User Role CRUD resolver', () => {
  it('Should Create User Role', async () => {
    const accessToken = await jwtSign({
      username: 'juan',
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const res = await gCall({
      source: create,
      accessToken,
      variableValues: {
        data: {
          name: 'hwerh',
        },
      },
    });
    expect(res.data?.admin.UserRole.crud.createUserRole.data.id).toBeDefined();
    expect(res.data?.admin.UserRole.crud.createUserRole.data.name).toBeDefined();
    expect(res.data?.admin.UserRole.crud.createUserRole.data.name).toBe('hwerh');
    expect(res.data?.admin.UserRole.crud.createUserRole.error).toBeFalsy();
  });

  it('Should Find One User Role', async () => {
    const userRole = await UserRole.create({ name: 'dfg' }).save();
    const accessToken = await jwtSign({
      username: 'juan',
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const res = await gCall({
      source: findOne,
      accessToken,
      variableValues: {
        id: userRole.id,
      },
    });
    expect(res.data?.admin.UserRole.crud.findUserRoleById.data.id).toBe(userRole.id.toString());
    expect(res.data?.admin.UserRole.crud.findUserRoleById.data.name).toBe(userRole.name);
    expect(res.data?.admin.UserRole.crud.findUserRoleById.error).toBeFalsy();
  });

  it('Should NOT Find One User Role', async () => {
    const accessToken = await jwtSign({
      username: 'juan',
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const res = await gCall({
      source: findOne,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
      },
    });
    expect(res.data?.admin.UserRole.crud.findUserRoleById.data).toBeNull();
    expect(res.data?.admin.UserRole.crud.findUserRoleById.error).toBeTruthy();
    expect(res.data?.admin.UserRole.crud.findUserRoleById.message).toBeDefined();
  });

  it('Should Find All User Roles', async () => {
    const accessToken = await jwtSign({
      username: 'juan',
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const res = await gCall({
      source: findAll,
      accessToken,
    });
    expect(res.data?.admin.UserRole.crud.getAllUserRole.data).toBeDefined();
    expect(res.data?.admin.UserRole.crud.getAllUserRole.error).toBeFalsy();
  });

  it('Should Delete User Role', async () => {
    const accessToken = await jwtSign({
      username: 'juan',
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const userRole = await UserRole.create({ name: 'dfhgsdfhgsdfh' }).save();
    const res = await gCall({
      source: deleteUserRole,
      accessToken,
      variableValues: {
        id: userRole.id,
      },
    });
    expect(res.data?.admin.UserRole.crud.deleteUserRole.error).toBeFalsy();
  });

  it('Should update User Role', async () => {
    const accessToken = await jwtSign({
      username: 'juan',
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    let userRole: UserRole | undefined = await UserRole.create({ name: 'Role1' }).save();
    const res = await gCall({
      source: updateUserRole,
      accessToken,
      variableValues: {
        id: userRole.id,
        data: { name: 'sdfsddggg' },
      },
    });
    userRole = await UserRole.findOne(res.data?.admin.UserRole.crud.updateUserRole.data.id);
    if (userRole) {
      expect(res.data?.admin.UserRole.crud.updateUserRole.data.name).toBe('sdfsddggg');
      expect(res.data?.admin.UserRole.crud.updateUserRole.error).toBeFalsy();
    }
  });

  it('Should NOT update User Role', async () => {
    const accessToken = await jwtSign({
      username: 'juan',
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const res = await gCall({
      source: updateUserRole,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
        data: { name: 'test' },
      },
    });
    expect(res.data?.admin.UserRole.crud.updateUserRole.error).toBeTruthy();
    expect(res.data?.admin.UserRole.crud.updateUserRole.message).toBeDefined();
  });

  it('Should update User Role Relations', async () => {
    let userRole: UserRole | undefined = await UserRole.create({ name: faker.name.firstName() }).save();
    const user = await User.create({ ...fakeUser }).save();
    const accessToken = await jwtSign({
      username: 'juan',
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: updateRelations,
      accessToken,
      variableValues: {
        id: userRole.id,
        data: { user: user.id },
        action: 'add',
      },
    });

    userRole = await UserRole.findOne(response.data?.admin.UserRole.crud.updateUserRoleRelations.id, {
      relations: ['users'],
    });
    if (userRole) {
      expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.data.users[0].id).toBe(user.id.toString());
      expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.error).toBeFalsy();
    }
  });

  it('Should NOT update user role', async () => {
    const user = await User.create({ ...fakeUser2 }).save();
    const accessToken = await jwtSign({
      username: 'juan',
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: updateRelations,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
        data: { user: user.id },
        action: 'add',
      },
    });
    expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.error).toBeTruthy();
    expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.message).toBeDefined();
  });

  it('Should Delete User Role Relations', async () => {
    const userRole: UserRole = await UserRole.create({ name: faker.name.firstName() }).save();
    const user = await User.create({ ...fakeUser3 }).save();
    await conn.createQueryBuilder().relation(UserRole, 'users').of(userRole).add(user);
    const accessToken = await jwtSign({
      username: 'juan',
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: updateRelations,
      accessToken,
      variableValues: {
        id: userRole.id,
        data: { user: user.id },
        action: 'delete',
      },
    });

    expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.data.users).toEqual([]);
    expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.error).toBeFalsy();
  });

  it('Should Not Delete User Role Relations', async () => {
    const userRole: UserRole = await UserRole.create({ name: faker.name.firstName() }).save();
    const user = await User.create({ ...fakeUser4 }).save();
    await conn.createQueryBuilder().relation(UserRole, 'users').of(userRole).add(user);
    const accessToken = await jwtSign({
      username: 'juan',
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: updateRelations,
      accessToken,
      variableValues: {
        id: Math.floor(Math.random() * Math.floor(10000)) + 200,
        data: { user: user.id },
        action: 'delete',
      },
    });

    expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.message).toBeDefined();
    expect(response.data?.admin.UserRole.crud.updateUserRoleRelations.error).toBeTruthy();
  });
});
