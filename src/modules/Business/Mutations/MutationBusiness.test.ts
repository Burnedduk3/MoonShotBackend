import { Recipes } from '@entities/Recipes.entity';
import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import { jwtSign } from '@utils/jwt';
import * as faker from 'faker';
import { Connection, getConnection } from 'typeorm';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

let restaurant: Restaurant | undefined;

const createRestaurant: string = `
mutation(
  $name: String!
  $address: String!
  $phoneNumber: String!
  $maxCapacity: Float!
  $userOwner: String!
) {
  business {
    createRestaurant(
      data: {
        name: $name
        address: $address
        phoneNumber: $phoneNumber
        maxCapacity: $maxCapacity
        userOwner: $userOwner
      }
    ) {
      error
      message
      data {
        restaurantIdentifier
        name
        maxCapacity
      }
    }
  }
}
`;

const addCompanion: string = `
# Write your query or mutation here
mutation(
  $userID: String!
  $phone: String!
  $completeName: String!
  $address: String!
  $reservationId:String!
) {
  business {
    addCompanion(
      data: {
        userID: $userID
        phone: $phone
        completeName: $completeName
        address: $address
      }
      reservationId: $reservationId
    ) {
      error
      message
      reservation {
        reservationIdentifier
        peopleQuantities
        companions {
          id
          completeName
        }
      }
    }
  }
}
`;

const failCreateRestaurant: string = `
mutation(
  $address: String!
  $phoneNumber: String!
  $maxCapacity: Float!
  $userOwner: String!
) {
  business {
    createRestaurant(
      data: {
        address: $address
        phoneNumber: $phoneNumber
        maxCapacity: $maxCapacity
        userOwner: $userOwner
      }
    ) {
      error
      message
      data {
        restaurantIdentifier
        name
        maxCapacity
      }
    }
  }
}
`;

const updateRestaurantInfo = `
mutation(
  $name: String!
  $address: String!
  $phoneNumber: String!
  $maxCapacity: Float!
  $restaurantId: String!
) {
  business {
    updateRestaurantInfo(
      restaurantId:$restaurantId
      data: {
        name: $name
        address: $address
        phoneNumber: $phoneNumber
        maxCapacity: $maxCapacity
      }
    ) {
      error
      message
      data {
        restaurantIdentifier
        name
        maxCapacity
      }
    }
  }
}
`;

const updateCapacity = `
mutation(
  $restaurantId: String!
  $action:String!
) {
  business {
    updateCapacity(
      data:{      restaurantId:$restaurantId},
      action:$action
    ) {
      error
      message
      data {
        restaurantIdentifier
        name
        maxCapacity
        locationCapacity
      }
    }
  }
}
`;
const updateDeleteMenu = `
mutation(
  $restaurantId: String!
  $price: Float!
  $name: String!
  $action: String!
  $description: String!
  $recipeCategory: String!
  $recipeIdentifier:String!
) {
  business {
    updateMenu(
      restaurantId: $restaurantId
      data: {
        name: $name
        price: $price
        description: $description
        recipeCategory: $recipeCategory
        recipeIdentifier:$recipeIdentifier
      }
      action: $action
    ) {
      error
      message
      data {
        restaurantIdentifier
        name
        maxCapacity
        locationCapacity
        recipes{
          name
        }
      }
    }
  }
}
`;
const updateMenu = `
mutation(
  $restaurantId: String!
  $price: Float!
  $name: String!
  $action: String!
  $description: String!
  $recipeCategory: String!
) {
  business {
    updateMenu(
      restaurantId: $restaurantId
      data: {
        name: $name
        price: $price
        description: $description
        recipeCategory: $recipeCategory
      }
      action: $action
    ) {
      error
      message
      data {
        restaurantIdentifier
        name
        maxCapacity
        locationCapacity
        recipes{
          name
        }
      }
    }
  }
}
`;

const updateRecipe = `
mutation(
  $recipeId: String!
  $price: Float!
  $name: String!
  $description: String!
  $recipeCategory: String!
) {
  business {
    updateRecipe(
      recipeId: $recipeId,
      data: {
        name: $name
        price: $price
        description: $description
        recipeCategory: $recipeCategory
      }
    ) {
      error
      message
      data {
\t\t\t\tid
        name
        price
      }
    }
  }
}
`;

describe('Business Mutation tests', () => {
  it('should create Restaurant', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });
    const user = await User.findOne();

    if (!accessToken || !user) throw new Error('No access token');

    const response = await gCall({
      source: createRestaurant,
      accessToken,
      variableValues: {
        name: faker.company.companyName(),
        address: faker.address.streetAddress(),
        phoneNumber: faker.address.streetAddress(),
        maxCapacity: Math.floor(Math.random() * Math.floor(10000)) + 200,
        userOwner: user?.username,
      },
    });
    expect(response.data?.business.createRestaurant.error).toBe(false);
    expect(response.data?.business.createRestaurant.data).toBeDefined();
    expect(response.data?.business.createRestaurant.message).toBeNull();

    restaurant = await Restaurant.findOne({
      restaurantIdentifier: response.data?.business.createRestaurant.data.restaurantIdentifier,
    });
    expect(restaurant).toBeDefined();
  });

  it('should Not create Restaurant', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });
    const user = await User.findOne();

    if (!accessToken || !user) throw new Error('No access token');

    const response = await gCall({
      source: failCreateRestaurant,
      accessToken,
      variableValues: {
        address: 'aks,jdhkjashd',
        phoneNumber: faker.address.streetAddress(),
        maxCapacity: Math.floor(Math.random() * Math.floor(10000)) + 200,
        userOwner: user?.username,
      },
    });
    expect(response.errors).toBeDefined();
  });

  it('should update Restaurant', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });
    const user = await User.findOne();

    if (!accessToken || !user || !restaurant) throw new Error('No access token');

    const response = await gCall({
      source: updateRestaurantInfo,
      accessToken,
      variableValues: {
        restaurantId: restaurant.restaurantIdentifier,
        name: faker.company.companyName(),
        address: faker.address.streetAddress(),
        phoneNumber: faker.address.streetAddress(),
        maxCapacity: Math.floor(Math.random() * Math.floor(10000)) + 200,
      },
    });
    expect(response.data?.business.updateRestaurantInfo.error).toBe(false);
    expect(response.data?.business.updateRestaurantInfo.data).toBeDefined();
    expect(response.data?.business.updateRestaurantInfo.message).toBeNull();

    restaurant = await Restaurant.findOne({
      restaurantIdentifier: response.data?.business.updateRestaurantInfo.data.restaurantIdentifier,
    });
    expect(restaurant?.name === response.data?.business.updateRestaurantInfo.data.name).toBe(true);
  });

  it('should update capacity add Restaurant', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });
    const user = await User.findOne();
    if (!accessToken || !user || !restaurant) throw new Error('No access token');
    const previouscapcity = restaurant.locationCapacity;
    const response = await gCall({
      source: updateCapacity,
      accessToken,
      variableValues: {
        restaurantId: restaurant.restaurantIdentifier,
        action: 'add',
      },
    });
    expect(response.data?.business.updateCapacity.error).toBe(false);
    expect(response.data?.business.updateCapacity.data).toBeDefined();
    expect(response.data?.business.updateCapacity.message).toBeNull();

    restaurant = await Restaurant.findOne({
      restaurantIdentifier: response.data?.business.updateCapacity.data.restaurantIdentifier,
    });
    expect(response.data?.business.updateCapacity.data.locationCapacity).toBeGreaterThan(previouscapcity);
  });

  it('should update capacity substraction Restaurant', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });
    const user = await User.findOne();
    if (!accessToken || !user || !restaurant) throw new Error('No access token');
    const previouscapcity = restaurant.locationCapacity;
    const response = await gCall({
      source: updateCapacity,
      accessToken,
      variableValues: {
        restaurantId: restaurant.restaurantIdentifier,
        action: 'substraction',
      },
    });
    expect(response.data?.business.updateCapacity.error).toBe(false);
    expect(response.data?.business.updateCapacity.data).toBeDefined();
    expect(response.data?.business.updateCapacity.message).toBeNull();

    restaurant = await Restaurant.findOne({
      restaurantIdentifier: response.data?.business.updateCapacity.data.restaurantIdentifier,
    });
    expect(response.data?.business.updateCapacity.data.locationCapacity).toBeLessThanOrEqual(previouscapcity);
  });

  it('should update menu add Restaurant', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });
    const user = await User.findOne();

    if (!accessToken || !user || !restaurant) throw new Error('No access token');
    restaurant = await Restaurant.findOne(
      {
        restaurantIdentifier: restaurant.restaurantIdentifier,
      },
      { relations: ['recipes'] },
    );
    if (!restaurant) throw new Error('No Restaurant token');
    const previousmenu = restaurant.recipes.length;
    const response = await gCall({
      source: updateMenu,
      accessToken,
      variableValues: {
        restaurantId: restaurant.restaurantIdentifier,
        price: 1000,
        name: 'test',
        action: 'add',
        description: 'descritpcion',
        recipeCategory: 'askdjhjkasgd',
      },
    });
    expect(response.data?.business.updateMenu.error).toBe(false);
    expect(response.data?.business.updateMenu.data).toBeDefined();
    expect(response.data?.business.updateMenu.message).toBeNull();

    restaurant = await Restaurant.findOne({
      restaurantIdentifier: response.data?.business.updateMenu.data.restaurantIdentifier,
    });
    expect(response.data?.business.updateMenu.data.recipes.length).toBeGreaterThan(previousmenu);
  });

  it('should update menu delete Restaurant', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });
    const user = await User.findOne();

    if (!accessToken || !user || !restaurant) throw new Error('No access token');
    restaurant = await Restaurant.findOne(
      {
        restaurantIdentifier: restaurant.restaurantIdentifier,
      },
      { relations: ['recipes'] },
    );
    if (!restaurant) throw new Error('No Restaurant token');
    const previousmenu = restaurant.recipes.length;
    const response = await gCall({
      source: updateDeleteMenu,
      accessToken,
      variableValues: {
        restaurantId: restaurant.restaurantIdentifier,
        price: 0,
        name: '',
        action: 'delete',
        description: '',
        recipeCategory: '',
        recipeIdentifier: restaurant.recipes[0].recipeIdentifier,
      },
    });
    expect(response.data?.business.updateMenu.error).toBe(false);
    expect(response.data?.business.updateMenu.data).toBeDefined();
    expect(response.data?.business.updateMenu.message).toBeNull();

    restaurant = await Restaurant.findOne({
      restaurantIdentifier: response.data?.business.updateMenu.data.restaurantIdentifier,
    });
    expect(response.data?.business.updateMenu.data.recipes.length).toBeLessThan(previousmenu);
  });

  it('should update Recipe Restaurant', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });
    const recipe = await Recipes.findOne();
    if (!accessToken || !recipe) throw new Error('No access token');
    const response = await gCall({
      source: updateRecipe,
      accessToken,
      variableValues: {
        recipeId: recipe.recipeIdentifier,
        price: 2000,
        name: 'adsfasdf',
        description: 'asdfadf',
        recipeCategory: 'qwerqwer',
      },
    });
    expect(response.data?.business.updateRecipe.error).toBe(false);
    expect(response.data?.business.updateRecipe.data).toBeDefined();
    expect(response.data?.business.updateRecipe.data.name).toBe('adsfasdf');
    expect(response.data?.business.updateRecipe.data.price).toBe(2000);
    expect(response.data?.business.updateRecipe.message).toBeNull();
  });

  it('should Not update Recipe Restaurant', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });
    if (!accessToken) throw new Error('No access token');
    const response = await gCall({
      source: updateRecipe,
      accessToken,
      variableValues: {
        recipeId: 'asdkjlhf',
        price: 2000,
        name: 'adsfasdf',
        description: 'asdfadf',
        recipeCategory: 'qwerqwer',
      },
    });
    expect(response.data?.business.updateRecipe.error).toBe(true);
    expect(response.data?.business.updateRecipe.data).toBeNull();
    expect(response.data?.business.updateRecipe.message).toBeDefined();
  });

  it('should add Companion', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });
    const user = await User.findOne();
    const reservation = await Reservation.create({
      reservationTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      peopleQuantities: 10,
    }).save();
    if (!accessToken || !user) throw new Error('No access token');
    await getConnection().createQueryBuilder().relation(Reservation, 'owner').of(reservation).set(user);
    reservation.owner = user;

    const response = await gCall({
      source: addCompanion,
      accessToken,
      variableValues: {
        userID: '7123123',
        phone: '90283409384',
        completeName: 'Test Name',
        address: 'creasdasdfeg',
        reservationId: reservation.reservationIdentifier,
      },
    });
    expect(response.data?.business.addCompanion.error).toBeFalsy();
    expect(response.data?.business.addCompanion.reservation.reservationIdentifier).toBe(
      reservation.reservationIdentifier,
    );
    expect(response.data?.business.addCompanion.reservation.companions[0].completeName).toBe('Test Name');
    expect(response.data?.business.addCompanion.message).toBeNull();
  });

  it('should Not add Companion', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });
    const user = await User.findOne();
    const reservation = await Reservation.create({
      reservationTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      peopleQuantities: 10,
    }).save();
    if (!accessToken || !user) throw new Error('No access token');
    await getConnection().createQueryBuilder().relation(Reservation, 'owner').of(reservation).set(user);
    reservation.owner = user;

    const response = await gCall({
      source: addCompanion,
      accessToken,
      variableValues: {
        userID: '7123123',
        phone: '90283409384',
        completeName: '',
        address: 'creasdasdfeg',
        reservationId: reservation.reservationIdentifier,
      },
    });
    expect(response.data?.business.addCompanion.error).toBeTruthy();
    expect(response.data?.business.addCompanion.reservation).toBeNull();
    expect(response.data?.business.addCompanion.message).toBeDefined();
    expect(response.data?.business.addCompanion.message).toBe('Not Complete data');
  });
});
