import { Restaurant } from '@entities/Restaurant.entity';
import { AdminRestaurantCrudResponse } from '@modules/admin/restaurants/crud/AdminRestaurantCrud.types';
import { CrudRestaurantUpdateInput } from '@modules/admin/restaurants/crud/CrudRestaurant.inputs';
import { getConnection } from 'typeorm';

export const updateRestaurantHandler = async (
  id: number,
  data: CrudRestaurantUpdateInput,
): Promise<AdminRestaurantCrudResponse> => {
  try {
    await getConnection()
      .createQueryBuilder()
      .update(Restaurant)
      .set({ ...data })
      .where('id = :id', { id })
      .execute();

    const restaurant = await Restaurant.findOne(id);

    if (!restaurant) throw new Error('Restaurant not found');

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
      message: 'Error updateBillHandler',
    };
  }
};
