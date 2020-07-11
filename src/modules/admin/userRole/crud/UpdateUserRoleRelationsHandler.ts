import { User } from '@entities/User.entity';
import { UserRole } from '@entities/UserRole.entity';
import { AdminUserRoleCrudResponse } from '@modules/admin/userRole/crud/AdminUserRoleCrud.types';
import { getConnection } from 'typeorm';
import { CrudUserRoleUpdateRelationsInputs } from './CrudUserRole.inputs';

export const updateUserRoleRelationsHandler = async (
  id: number,
  data: CrudUserRoleUpdateRelationsInputs,
  action: string,
): Promise<AdminUserRoleCrudResponse> => {
  try {
    const userRole = await UserRole.findOne(id, {
      relations: ['users'],
    });

    if (!userRole) throw new Error('Lawyer Category not found');

    if (action === 'add') {
      if (data.user) {
        const user = await User.findOne(data.user);
        if (!user) throw new Error('user not Found');
        await getConnection().createQueryBuilder().relation(UserRole, 'users').of(userRole).add(user);
        userRole.users.push(user);
      }
    }

    if (action === 'delete') {
      if (data.user) {
        const user = await User.findOne(data.user);
        if (!user) throw new Error('user not Found');
        await getConnection().createQueryBuilder().relation(UserRole, 'users').of(userRole).remove(user);
        const indexToDelete = userRole.users.findIndex((element: User) => {
          if (element.username === user.username) {
            return true;
          }
          /* istanbul ignore next */
          return false;
        });
        if (indexToDelete !== -1) {
          userRole.users.splice(indexToDelete, 1);
        }
      }
    }

    return {
      error: false,
      data: userRole,
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
      message: 'Error updateUserRelationsHandler',
    };
  }
};
