import { User } from '@entities/User.entity';
import { Context } from '@interfaces/Context.types';
import { isAuth } from '@middlewares/isAuth';
import { isUser } from '@middlewares/isUser';
import { getAllRestaurants } from '@modules/user/Query/getAllReservations';
import { getReservationById } from '@modules/user/Query/getReservationById';
import { Arg, Ctx, FieldResolver, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getRestaurants } from './getRestaurants';
import { meHandler } from './me';
import { updateUserHandler } from './updateUser';
import { IGetReservationById, IGetRestaurantsInputs, IUpdateUserInputs } from './User.inputs';
import {
  IUserGetRestaurants,
  IUserReservationArrayResponse,
  IUserReservationResponse,
  UpdateUserResponse,
  UserTypes,
} from './User.types';

@Resolver(() => UserTypes)
export class UserResolver {
  @Query(() => UserTypes)
  user(): UserTypes {
    return new UserTypes();
  }

  @FieldResolver()
  @UseMiddleware(isAuth)
  async me(@Ctx() ctx: Context): Promise<User | null> {
    return meHandler(ctx);
  }

  @FieldResolver()
  @UseMiddleware(isAuth)
  async updateUser(@Ctx() ctx: Context, @Arg('data') data: IUpdateUserInputs): Promise<UpdateUserResponse> {
    return updateUserHandler(ctx, data);
  }

  @FieldResolver(/* istanbul ignore next */ () => IUserReservationArrayResponse)
  @UseMiddleware([isAuth, isUser])
  async getAllReservation(@Ctx() ctx: Context): Promise<IUserReservationArrayResponse> {
    return getAllRestaurants(ctx);
  }

  @FieldResolver(/* istanbul ignore next */ () => IUserReservationResponse)
  @UseMiddleware([isAuth])
  async getReservationById(@Arg('data') data: IGetReservationById): Promise<IUserReservationResponse> {
    return getReservationById(data);
  }

  @FieldResolver(/* istanbul ignore next */ () => IUserGetRestaurants)
  @UseMiddleware([isAuth, isUser])
  async getRestaurants(@Arg('data') data: IGetRestaurantsInputs): Promise<IUserGetRestaurants> {
    return getRestaurants(data);
  }
}
