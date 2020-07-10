import { UserRole } from '@entities/UserRole.entity';
import { Arg, FieldResolver, Resolver } from 'type-graphql';
import {
  AdminUserRoleArrayCrudResponse,
  AdminUserRoleCrudResponse,
  AdminUserRoleCrudTypes,
} from './AdminUserRoleCrud.types';
import {
  CrudCreateUserRoleInputs,
  CrudUserRoleUpdateInput,
  CrudUserRoleUpdateRelationsInputs,
} from './CrudUserRole.inputs';
import { updateUserRoleHandler } from './UpdateUserRoleHandler';
import { updateUserRoleRelationsHandler } from './UpdateUserRoleRelationsHandler';

@Resolver(() => AdminUserRoleCrudTypes)
export class AdminUserRoleCrudResolver {
  @FieldResolver(/* istanbul ignore next */ () => AdminUserRoleCrudTypes) // without args
  async updateUserRole(
    @Arg('id') id: number,
    @Arg('data') data: CrudUserRoleUpdateInput,
  ): Promise<AdminUserRoleCrudResponse> {
    return await updateUserRoleHandler(id, data);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminUserRoleCrudTypes)
  async updateUserRoleRelations(
    @Arg('id') id: number,
    @Arg('data') data: CrudUserRoleUpdateRelationsInputs,
    @Arg('action') action: string,
  ): Promise<AdminUserRoleCrudResponse> {
    return await updateUserRoleRelationsHandler(id, data, action);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminUserRoleCrudTypes)
  async createUserRole(@Arg('data') data: CrudCreateUserRoleInputs): Promise<AdminUserRoleCrudResponse> {
    try {
      const userRole = await UserRole.create({
        ...data,
      }).save();

      if (!userRole) throw new Error('Could not create user Role');

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
        message: 'Could Not Create user Role',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminUserRoleCrudTypes)
  async deleteUserRole(@Arg('id') id: number): Promise<AdminUserRoleCrudResponse> {
    try {
      await UserRole.delete(id);

      return {
        error: false,
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
        message: 'Could Not delete user Role',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminUserRoleCrudTypes)
  async getAllUserRole(): Promise<AdminUserRoleArrayCrudResponse> {
    try {
      const userRoles = await UserRole.find({ relations: ['users'] });

      if (!userRoles) throw new Error('No user Role Found');

      return {
        error: false,
        data: userRoles,
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
        message: 'No user Role Found',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminUserRoleCrudTypes)
  async findUserRoleById(@Arg('id') id: number): Promise<AdminUserRoleCrudResponse> {
    try {
      const userRole = await UserRole.findOne(id, { relations: ['users'] });

      if (!userRole) throw new Error('No user Role Found');

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
        message: 'No user Role Found',
      };
    }
  }
}
