 import { User } from '@entities/User.entity';
import { Context } from '@interfaces/Context.types';
import { IUserReservationArrayResponse } from '../User.types';

export const getAllRestaurants = async (ctx: Context): Promise<IUserReservationArrayResponse> => {
  try {
    if (!ctx.payload) throw new Error('No token provided');
    const username = ctx.payload.username;
    if (!username) throw new Error('No token provided');
    const user = await User.findOne({ username }, { relations: ['reservations'] });

    if (!user) throw new Error('Error retrieving reservations');

    return {
      error: false,
      data: user.reservations,
    };
  } catch (e) {
    return {
      error: true,
      message: (e as Error).message,
    };
  }
};
