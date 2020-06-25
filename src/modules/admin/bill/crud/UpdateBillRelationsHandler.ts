import { Bill } from '@entities/Bill.entity';
import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { AdminBillCrudResponse } from '@modules/admin/bill/crud/AdminBillCrud.types';
import { CrudBillUpdateRelationsInputs } from '@modules/admin/bill/crud/CrudBill.inputs';
import { getConnection } from 'typeorm';

export const updateBillRelationsHandler = async (
  id: number,
  data: CrudBillUpdateRelationsInputs,
  _action: string,
): Promise<AdminBillCrudResponse> => {
  try {
    const bill = await Bill.findOne(id, {
      relations: ['userOwner', 'restaurant', 'billRecipes'],
    });

    if (!bill) throw new Error('Bill not found');

    if (data.restaurantId) {
      const restaurant = await Restaurant.findOne(data.restaurantId);
      if (!restaurant) throw new Error('restaurant not Found');
      await getConnection().createQueryBuilder().relation(Bill, 'restaurant').of(bill).set(restaurant);
      bill.restaurant = restaurant;
    }

    if (data.userId) {
      const user = await User.findOne(data.userId);
      if (!user) throw new Error('restaurant not Found');
      await getConnection().createQueryBuilder().relation(Bill, 'userOwner').of(bill).set(user);
      bill.userOwner = user;
    }

    // if (_action === 'add') {
    //   if (data.recipeId) {
    //     const recipe = await Recipes.findOne(data.recipeId);
    //     if (!recipe) throw new Error('restaurant not Found');
    //     bill.billRecipes.push(recipe);
    //     await getConnection().manager.save(bill);
    //   }
    // }
    //
    // if (_action === 'delete') {
    //   if (data.recipeId) {
    //     const recipe = await Recipes.findOne(data.recipeId);
    //     if (!recipe) throw new Error('restaurant not Found');
    //     const indexToDelete = bill.billRecipes.indexOf(recipe);
    //     bill.billRecipes.splice(indexToDelete, 1);
    //     await getConnection().manager.save(bill);
    //   }
    // }

    return {
      error: false,
      data: bill,
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
      message: 'Error updateBillRelationsHandler',
    };
  }
};
