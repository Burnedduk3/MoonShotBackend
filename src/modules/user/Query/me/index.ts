import { User } from '@entities/User.entity';
import { Context } from '@interfaces/Context.types';

export const meHandler = async (ctx: Context): Promise<User | null> => {
  try {
    if (!ctx.payload) throw new Error('No token provided');
    const username = ctx.payload.username;
    if (!username) throw new Error('No token provided');
    const user = await User.findOne({ username }, { relations: ['role', 'restaurant', 'reservations'] });
    if (!user) throw new Error('No user');
    return user;
  } catch (error) {
    return null;
  }
};
