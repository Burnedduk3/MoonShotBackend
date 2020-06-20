import { User } from '@entities/User.entity';
import { Context } from '@interfaces/Context.types';
import { getConnection } from 'typeorm';
import { IUpdateUserInputs } from '../User.inputs';
import { UpdateUserResponse } from '../User.types';

export const updateUserHandler = async (ctx: Context, data: IUpdateUserInputs): Promise<UpdateUserResponse> => {
  try {
    const phone = ctx.payload?.phone;
    let user = await User.findOne({ phone });
    if (!user) throw new Error('no user');

    if (Object.keys(data).length === 0)
      return {
        error: false,
        user,
      };

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ ...data })
      .where('phone = :phone', { phone })
      .execute();
    user = await User.findOne({ phone }, { relations: ['role'] });
    return {
      error: false,
      user,
    };
  } catch (e) {
    return {
      error: true,
      message: (e as Error).message,
    };
  }
};
