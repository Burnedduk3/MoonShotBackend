import { UserRole } from '@entities/UserRole.entity';
import { AdminUserRoleCrudResponse } from '@modules/admin/userRole/crud/AdminUserRoleCrud.types';
import { getConnection } from 'typeorm';
import { CrudUserRoleUpdateInput } from './CrudUserRole.inputs';

export const updateUserRoleHandler = async (
  id: number,
  data: CrudUserRoleUpdateInput,
): Promise<AdminUserRoleCrudResponse> => {
  try {
    await getConnection()
      .createQueryBuilder()
      .update(UserRole)
      .set({ ...data })
      .where('id = :id', { id })
      .execute();

    const userRole = await UserRole.findOne(id);

    if (!userRole) throw new Error('user Role not found');

    return {
      error: false,
      data: userRole,
    };
  } catch (e) {
    /* istanbul ignore next */
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
