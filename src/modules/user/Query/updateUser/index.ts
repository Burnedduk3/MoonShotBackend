import { User } from '@entities/User.entity';
import { Context } from '@interfaces/Context.types';
import { getConnection } from 'typeorm';
import { IUpdateUserInputs } from '../User.inputs';
import { UpdateUserResponse } from '../User.types';

export const updateUserHandler = async (ctx: Context, data: IUpdateUserInputs): Promise<UpdateUserResponse> => {
  try {
    const username = ctx.payload?.username;
    let user = await User.findOne({ username });
    if (!user) throw new Error('no user');

    if (Object.keys(data).length === 0)
      /* istanbul ignore next */
      return {
        error: false,
        user,
      };

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ ...data })
      .where('username = :username', { username })
      .execute();
    user = await User.findOne({ username }, { relations: ['role'] });
    return {
      error: false,
      user,
    };
  } catch (e) {
    /* istanbul ignore next */
    return {
      error: true,
      message: (e as Error).message,
    };
  }
};
