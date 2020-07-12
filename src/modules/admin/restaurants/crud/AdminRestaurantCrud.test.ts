import { Recipes } from '@entities/Recipes.entity';
import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
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

const create: string = `
query($name: String! $address: String! $phoneNumber: String!) {
  admin {
    Restaurants {
      crud {
        createRestaurant(
          data: { name: $name, address: $address, phoneNumber: $phoneNumber }
        ){
          error
          message
          data{
            id
            restaurantIdentifier
            name
            address
          }
        }
      }
    }
  }
}
`;

const deleteRestaurant: string = `
query($id: Float!) {
  admin {
    Restaurants {
      crud {
        deleteRestaurant(id: $id) {
          error
          message
          data {
            id
            restaurantIdentifier
            name
            address
          }
        }
      }
    }
  }
}
`;

const findById: string = `
query($id: Float!) {
  admin {
    Restaurants {
      crud {
        findRestaurantById(id: $id) {
          error
          message
          data {
            id
            restaurantIdentifier
            name
            address
          }
        }
      }
    }
  }
}
`;

const getAll: string = `
query {
  admin {
    Restaurants {
      crud {
        getAllRestaurant {
          error
          message
          data {
            id
            restaurantIdentifier
            name
            address
          }
        }
      }
    }
  }
}
`;

const updateRestaurant = `
query($id: Float! $name:String! $address:String! $phoneNumber:String!) {
  admin {
    Restaurants {
      crud {
        updateRestaurant(
          id: $id
          data: { name: $name, address: $address, phoneNumber: $phoneNumber }
        ) {
          error
          message
          data {
            id
            restaurantIdentifier
            name
            address
          }
        }
      }
    }
  }
}
`;

const updateRestaurantRelations: string = `
query(
  $id: Float!
  $action: String!
  $ownerId: Float!
  $recipeId: Float!
  $reservationId: Float!
) {
  admin {
    Restaurants {
      crud {
        updateRestaurantRelations(
          id: $id
          action: $action
          data: {
            ownerId: $ownerId
            recipeId: $recipeId
            reservationId: $reservationId
          }
        ) {
          error
          message
          data {
            id
            restaurantIdentifier
            name
            address
            owner{
              username
            }
            recipes{
              name
            },
            reservations{
              reservationIdentifier
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
  userID: faker.phone.phoneNumber(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.name.jobArea(),
  password: faker.name.firstName(),
  email: faker.company.catchPhrase(),
};

const fakeUser2 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.internet.protocol(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.address.city(),
  password: faker.name.firstName(),
  email: faker.hacker.adjective(),
};

const fakeUser3 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.phone.phoneNumber(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.hacker.noun(),
  password: faker.name.firstName(),
  email: faker.hacker.noun(),
};

const fakeUser4 = {
  phone: faker.phone.phoneNumber(),
  userID: faker.lorem.word(),
  firstName: faker.name.firstName(),
  secondName: faker.name.firstName(),
  firstLastname: faker.name.lastName(),
  secondLastname: faker.name.lastName(),
  username: faker.finance.accountName(),
  password: faker.name.firstName(),
  email: faker.hacker.abbreviation(),
};

describe('Admin Restaurant CRUD test', () => {
  it('should Create Restaurant', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: create,
      accessToken,
      variableValues: {
        name: 'Pepito',
        address: 'cra 5 fvgsdlfgsdfg',
        phoneNumber: '12309812467',
      },
    });
    expect(response.data?.admin.Restaurants.crud.createRestaurant.error).toBe(false);
    expect(response.data?.admin.Restaurants.crud.createRestaurant.data.restaurantIdentifier).toBeDefined();
    expect(response.data?.admin.Restaurants.crud.createRestaurant.data.name).toBe('Pepito');
  });

  it('should delete Restaurant', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    const restaurant = await Restaurant.create({
      name: 'Pepito',
      address: 'cra 5 fvgsdlfgsdfg',
      phoneNumber: '12309812467',
    }).save();
    if (!accessToken || !restaurant) throw new Error('No access token');

    const response = await gCall({
      source: deleteRestaurant,
      accessToken,
      variableValues: {
        id: restaurant.id,
      },
    });
    expect(response.data?.admin.Restaurants.crud.deleteRestaurant.error).toBe(false);
    expect(response.data?.admin.Restaurants.crud.deleteRestaurant.message).toBeNull();
    expect(response.data?.admin.Restaurants.crud.deleteRestaurant.data).toBeNull();
  });

  it('should Not delete Restaurant', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const response = await gCall({
      source: deleteRestaurant,
      accessToken,
      variableValues: {
        id: Math.floor(Math.floor(2000) + Math.random()) + 200,
      },
    });
    expect(response.data?.admin.Restaurants.crud.deleteRestaurant.error).toBe(true);
    expect(response.data?.admin.Restaurants.crud.deleteRestaurant.message).toBeDefined();
    expect(response.data?.admin.Restaurants.crud.deleteRestaurant.data).toBeNull();
  });

  it('should find Restaurant by id', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    const restaurant = await Restaurant.create({
      name: 'Pepito',
      address: 'cra 5 fvgsdlfgsdfg',
      phoneNumber: '12309812467',
    }).save();
    if (!accessToken || !restaurant) throw new Error('No access token');

    const response = await gCall({
      source: findById,
      accessToken,
      variableValues: {
        id: restaurant.id,
      },
    });
    expect(response.data?.admin.Restaurants.crud.findRestaurantById.error).toBe(false);
    expect(response.data?.admin.Restaurants.crud.findRestaurantById.message).toBeNull();
    expect(response.data?.admin.Restaurants.crud.findRestaurantById.data).toBeDefined();
    expect(response.data?.admin.Restaurants.crud.findRestaurantById.data.name).toBe(restaurant.name);
    expect(response.data?.admin.Restaurants.crud.findRestaurantById.data.restaurantIdentifier).toBe(
      restaurant.restaurantIdentifier,
    );
  });

  it('should Not find Restaurant by id', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const response = await gCall({
      source: findById,
      accessToken,
      variableValues: {
        id: Math.floor(Math.floor(2000) + Math.random()) + 200,
      },
    });
    expect(response.data?.admin.Restaurants.crud.findRestaurantById.error).toBe(true);
    expect(response.data?.admin.Restaurants.crud.findRestaurantById.message).toBeDefined();
    expect(response.data?.admin.Restaurants.crud.findRestaurantById.data).toBeNull();
  });

  it('should find all restaurants', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: getAll,
      accessToken,
    });

    expect(response.data?.admin.Restaurants.crud.getAllRestaurant.error).toBe(false);
    expect(response.data?.admin.Restaurants.crud.getAllRestaurant.message).toBeNull();
    expect(response.data?.admin.Restaurants.crud.getAllRestaurant.data).toBeDefined();
  });

  it('should update Restaurant', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    const restaurant = await Restaurant.create({
      name: 'test',
      address: 'asdasd',
      phoneNumber: '12312332',
      maxCapacity: 200,
    }).save();
    if (!accessToken || !restaurant) throw new Error('No access token');
    const response = await gCall({
      source: updateRestaurant,
      accessToken,

      variableValues: {
        id: restaurant.id,
        name: 'frisby',
        address: 'cra 4 # 123 - 523',
        phoneNumber: '1231234124',
      },
    });

    expect(response.data?.admin.Restaurants.crud.updateRestaurant.error).toBe(false);
    expect(response.data?.admin.Restaurants.crud.updateRestaurant.message).toBeNull();
    expect(response.data?.admin.Restaurants.crud.updateRestaurant.data).toBeDefined();
    expect(response.data?.admin.Restaurants.crud.updateRestaurant.data.restaurantIdentifier).toBe(
      restaurant.restaurantIdentifier,
    );
    expect(response.data?.admin.Restaurants.crud.updateRestaurant.data.name).toBe('frisby');
    expect(response.data?.admin.Restaurants.crud.updateRestaurant.data.address).toBe('cra 4 # 123 - 523');
  });

  it('should Not update Restaurant by id', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    if (!accessToken) throw new Error('No access token');

    const response = await gCall({
      source: updateRestaurant,
      accessToken,
      variableValues: {
        id: Math.floor(Math.floor(2000) + Math.random()) + 200,
        name: 'frisby',
        address: 'cra 4 # 123 - 523',
        phoneNumber: '1231234124',
      },
    });
    expect(response.data?.admin.Restaurants.crud.updateRestaurant.error).toBe(true);
    expect(response.data?.admin.Restaurants.crud.updateRestaurant.message).toBeDefined();
    expect(response.data?.admin.Restaurants.crud.updateRestaurant.data).toBeNull();
  });

  it('should update Restaurant relations add', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    const restaurant = await Restaurant.create({
      name: 'test',
      address: 'asdasd',
      phoneNumber: '12312332',
      maxCapacity: 200,
    }).save();
    const user = await User.create({ ...fakeUser2 }).save();
    const recipe = await Recipes.create({
      name: 'testing',
      price: 2000,
      recipeCategory: 'asdasd',
      description: 'asdasdasdasd',
    }).save();
    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: '2020-07-30 14:38:54.85',
    }).save();
    if (!accessToken || !restaurant || !user || !recipe || !reservation) throw new Error('No access token');
    const response = await gCall({
      source: updateRestaurantRelations,
      accessToken,
      variableValues: {
        id: restaurant.id,
        action: 'add',
        ownerId: user.id,
        recipeId: recipe.id,
        reservationId: reservation.id,
      },
    });

    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.error).toBe(false);
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.message).toBeNull();
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.data).toBeDefined();
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.data.restaurantIdentifier).toBe(
      restaurant.restaurantIdentifier,
    );
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.data.owner.username).toBe(user.username);
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.data.recipes).toBeDefined();
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.data.reservations).toBeDefined();
  });

  it('should update Restaurant relations delete', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    const restaurant = await Restaurant.create({
      name: 'test',
      address: 'asdasd',
      phoneNumber: '12312332',
      maxCapacity: 200,
    }).save();
    const user = await User.create({ ...fakeUser4 }).save();
    const recipe = await Recipes.create({
      name: 'testing',
      price: 2000,
      recipeCategory: 'asdasd',
      description: 'asdasdasdasd',
    }).save();
    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: '2020-07-30 14:38:54.85',
    }).save();
    await conn.createQueryBuilder().relation(Restaurant, 'reservations').of(restaurant).add(reservation);
    await conn.createQueryBuilder().relation(Restaurant, 'recipes').of(restaurant).add(recipe);
    if (!accessToken || !restaurant || !user || !recipe || !reservation) throw new Error('No access token');
    const response = await gCall({
      source: updateRestaurantRelations,
      accessToken,
      variableValues: {
        id: restaurant.id,
        action: 'delete',
        ownerId: user.id,
        recipeId: recipe.id,
        reservationId: reservation.id,
      },
    });
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.error).toBe(false);
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.message).toBeNull();
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.data).toBeDefined();
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.data.restaurantIdentifier).toBe(
      restaurant.restaurantIdentifier,
    );
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.data.owner.username).toBe(user.username);
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.data.recipes).toBeDefined();
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.data.reservations).toBeDefined();
  });

  it('should Not update Restaurant relations add', async () => {
    const accessToken = await jwtSign({
      username: fakeUser.firstName,
      type: 'test',
      role: 'admin',
    });
    const restaurant = await Restaurant.create({
      name: 'test',
      address: 'asdasd',
      phoneNumber: '12312332',
      maxCapacity: 200,
    }).save();
    const user = await User.create({ ...fakeUser3 }).save();
    const recipe = await Recipes.create({
      name: 'testing',
      price: 2000,
      recipeCategory: 'asdasd',
      description: 'asdasdasdasd',
    }).save();
    const reservation = await Reservation.create({
      peopleQuantities: 10,
      reservationTime: '2020-07-30 14:38:54.85',
    }).save();
    if (!accessToken || !restaurant || !user || !recipe || !reservation) throw new Error('No access token');
    const response = await gCall({
      source: updateRestaurantRelations,
      accessToken,
      variableValues: {
        id: Math.floor(Math.floor(2000) + Math.random()) + 200,
        action: 'add',
        ownerId: user.id,
        recipeId: recipe.id,
        reservationId: reservation.id,
      },
    });
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.error).toBe(true);
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.message).toBeDefined();
    expect(response.data?.admin.Restaurants.crud.updateRestaurantRelations.data).toBeNull();
  });
});
