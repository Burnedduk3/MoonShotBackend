import { Recipes } from '@entities/Recipes.entity';
import { Reservation } from '@entities/Reservation.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { AdminRestaurantCrudResponse } from '@modules/admin/restaurants/crud/AdminRestaurantCrud.types';
import { CrudRestaurantUpdateRelationsInputs } from '@modules/admin/restaurants/crud/CrudRestaurant.inputs';
import { getConnection } from 'typeorm';

export const updateRestaurantRelationsHandler = async (
  id: number,
  data: CrudRestaurantUpdateRelationsInputs,
  action: string,
): Promise<AdminRestaurantCrudResponse> => {
  try {
    const restaurant = await Restaurant.findOne(id, {
      relations: ['owner', 'recipes', 'reservations'],
    });

    if (!restaurant) throw new Error('Restaurant not found');

    if (action === 'add') {
      if (data.recipeId) {
        const recipe = await Recipes.findOne(data.recipeId);
        if (!recipe) throw new Error('recipe not Found');
        await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(restaurant).add(recipe);
        restaurant.recipes.push(recipe);
      }

      if (data.reservationId) {
        const reservation = await Reservation.findOne(data.reservationId);
        if (!reservation) throw new Error('reservation not Found');
        await getConnection().createQueryBuilder().relation(Restaurant, 'reservations').of(restaurant).add(reservation);
        restaurant.reservations.push(reservation);
      }
    }

    if (action === 'delete') {
      if (data.recipeId) {
        const recipe = await Recipes.findOne(data.recipeId);
        if (!recipe) throw new Error('recipe not Found');
        await getConnection().createQueryBuilder().relation(Restaurant, 'recipes').of(restaurant).remove(recipe);
        const indexToDelete = restaurant.recipes.findIndex((element: Recipes) => {
          if (element.recipeIdentifier === recipe.recipeIdentifier) {
            return true;
          }
          /* istanbul ignore next */
          return false;
        });
        if (indexToDelete !== -1) {
          restaurant.recipes.splice(indexToDelete, 1);
        }
      }

      if (data.reservationId) {
        const reservation = await Reservation.findOne(data.reservationId);
        if (!reservation) throw new Error('reservation not Found');
        await getConnection()
          .createQueryBuilder()
          .relation(Restaurant, 'reservations')
          .of(restaurant)
          .remove(reservation);
        const indexToDelete = restaurant.reservations.findIndex((element: Reservation) => {
          if (element.reservationIdentifier === reservation.reservationIdentifier) {
            return true;
          }
          /* istanbul ignore next */
          return false;
        });
        if (indexToDelete !== -1) {
          restaurant.reservations.splice(indexToDelete, 1);
        }
      }
    }

    if (data.ownerId) {
      const user = await User.findOne(data.ownerId);
      if (!user) throw new Error('No user was found');
      await getConnection().createQueryBuilder().relation(Restaurant, 'owner').of(restaurant).set(user);
      restaurant.owner = user;
    }

    return {
      error: false,
      data: restaurant,
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: true,
        message: e.message,
      };
    }
    /* istanbul ignore next */
    return {
      error: true,
      message: 'Error updateReservationRelationHandler',
    };
  }
};
