import { User } from '@entities/User.entity';
import { updateUserHandler } from '@modules/admin/user/crud/UpdateUserHandler';
import { updateUserRelationsHandler } from '@modules/admin/user/crud/UpdateUserRelationsHandler';
import { Arg, FieldResolver, Resolver } from 'type-graphql';
import { AdminUserArrayCrudResponse, AdminUserCrudResponse, AdminUserCrudTypes } from './AdminUserCrud.types';
import { CrudCreateUserInputs, CrudUserUpdateInput, CrudUserUpdateRelationsInputs } from './CrudUser.inputs';

@Resolver(() => AdminUserCrudTypes)
export class AdminUserCrudResolver {
  @FieldResolver(/* istanbul ignore next */ () => AdminUserCrudTypes) // without args
  async updateUser(@Arg('id') id: number, @Arg('data') data: CrudUserUpdateInput): Promise<AdminUserCrudResponse> {
    return await updateUserHandler(id, data);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminUserCrudTypes)
  async updateUserRelations(
    @Arg('id') id: number,
    @Arg('data') data: CrudUserUpdateRelationsInputs,
    @Arg('action') action: string,
  ): Promise<AdminUserCrudResponse> {
    return await updateUserRelationsHandler(id, data, action);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminUserCrudTypes)
  async createUser(@Arg('data') data: CrudCreateUserInputs): Promise<AdminUserCrudResponse> {
    try {
      const user = await User.create({
        ...data,
      }).save();

      if (!user) throw new Error('Could not create user Role');

      return {
        error: false,
        data: user,
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

  @FieldResolver(/* istanbul ignore next */ () => AdminUserCrudTypes)
  async deleteUser(@Arg('id') id: number): Promise<AdminUserCrudResponse> {
    try {
      await User.delete(id);

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

  @FieldResolver(/* istanbul ignore next */ () => AdminUserCrudTypes)
  async getAllUser(): Promise<AdminUserArrayCrudResponse> {
    try {
      const users = await User.find({ relations: ['role', 'restaurants'] });

      if (!users) throw new Error('No user Role Found');

      return {
        error: false,
        data: users,
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

  @FieldResolver(/* istanbul ignore next */ () => AdminUserCrudTypes)
  async findUserById(@Arg('id') id: number): Promise<AdminUserCrudResponse> {
    try {
      const user = await User.findOne(id, { relations: ['role', 'restaurants'] });

      if (!user) throw new Error('No user Role Found');

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
        message: 'No user Role Found',
      };
    }
  }
}
