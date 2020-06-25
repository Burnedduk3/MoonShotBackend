import { Bill } from '@entities/Bill.entity';
import { AdminBillCrudResponse } from '@modules/admin/bill/crud/AdminBillCrud.types';
import { CrudBillUpdateInput } from '@modules/admin/bill/crud/CrudBill.inputs';
import { getConnection } from 'typeorm';

export const updateBillHandler = async (
  id: number,
  data: CrudBillUpdateInput,
): Promise<AdminBillCrudResponse> => {
  try {
    await getConnection()
      .createQueryBuilder()
      .update(Bill)
      .set({ ...data })
      .where('id = :id', { id })
      .execute();

    const restaurant = await Bill.findOne(id);

    if (!restaurant) throw new Error('Bill not found');

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
