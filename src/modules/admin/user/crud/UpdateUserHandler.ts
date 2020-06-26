import { User } from '@entities/User.entity';
import { AdminUserCrudResponse } from '@modules/admin/user/crud/AdminUserCrud.types';
import { CrudUserUpdateInput } from '@modules/admin/user/crud/CrudUser.inputs';
import { getConnection } from 'typeorm';

export const updateUserHandler = async (
  id: number,
  data: CrudUserUpdateInput,
): Promise<AdminUserCrudResponse> => {
  try {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ ...data })
      .where('id = :id', { id })
      .execute();

    const user = await User.findOne(id);

    if (!user) throw new Error('BusinessTypes not found');

    return {
      error: false,
      data: user,
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
