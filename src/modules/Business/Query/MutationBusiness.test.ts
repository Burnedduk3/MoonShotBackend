import { Restaurant } from '@entities/Restaurant.entity';
import { gCall } from '@test/gCall';
import { testConn } from '@test/testCon';
import { jwtSign } from '@utils/jwt';
import { Connection } from 'typeorm';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const getMenu: string = `
query($restaurantIdentifier: String!) {
  Business {
    getRestaurantRecipes(
      data: { restaurantIdentifier: $restaurantIdentifier }
    ) {
      error
      message
      data {
        name
      }
    }
  }
}
`;

const getReservations: string =`
query($restaurantIdentifier: String!) {
  Business {
    getRestaurantReservations(
      data: { restaurantIdentifier: $restaurantIdentifier }
    ) {
      error
      message
      data {
        peopleQuantities
      }
    }
  }
}
`;

describe('Business Query tests', () => {
  it('should bring menu from restaurant', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });

    const restaurant = await Restaurant.findOne({ where: { name: 'Andres' } });
    if (!accessToken || !restaurant) throw new Error('No access token');
    const response = await gCall({
      source: getMenu,
      accessToken,
      variableValues: {
        restaurantIdentifier: restaurant.restaurantIdentifier,
      },
    });

    expect(response.data?.Business.getRestaurantRecipes.error).toBe(false);
    expect(response.data?.Business.getRestaurantRecipes.data).toBeDefined();
    expect(response.data?.Business.getRestaurantRecipes.data.length).toBeGreaterThan(0);
  });

  it('should bring reservations from restaurant', async () => {
    const accessToken = await jwtSign({
      username: 'JuanPer',
      type: 'test',
      role: 'business',
    });

    const restaurant = await Restaurant.findOne({ where: { name: 'Andres' } });
    if (!accessToken || !restaurant) throw new Error('No access token');
    const response = await gCall({
      source: getReservations,
      accessToken,
      variableValues: {
        restaurantIdentifier: restaurant.restaurantIdentifier,
      },
    });

    expect(response.data?.Business.getRestaurantReservations.error).toBe(false);
    expect(response.data?.Business.getRestaurantReservations.data).toBeDefined();
  });
});
