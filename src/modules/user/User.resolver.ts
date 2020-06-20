import { User } from '@entities/User.entity';
import { Context } from '@interfaces/Context.types';
import { isAuth } from '@middlewares/isAuth';
import { Arg, Ctx, FieldResolver, Query, Resolver, UseMiddleware } from 'type-graphql';
import { meHandler } from './me';
import { updateUserHandler } from './updateUser';
import { IUpdateUserInputs } from './User.inputs';
import { UpdateUserResponse, UserTypes } from './User.types';

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
}
