import { bookUpdate } from '@modules/user/Mutations/BookRestaurant';
import { IUpdateRestaurantUserCapacity } from '@modules/user/Mutations/User.inputs';
import { UpdateRestaurantUserResponse, UserMutationTypes } from '@modules/user/Mutations/User.types';
import { Arg, FieldResolver, Mutation, Publisher, PubSub, Resolver } from 'type-graphql';

@Resolver(() => UserMutationTypes)
export class UserResolver {
  @Mutation(() => UserMutationTypes)
  // @UseMiddleware([isAuth, isUser])
  user(): UserMutationTypes {
    return new UserMutationTypes();
  }

  @FieldResolver(() => UpdateRestaurantUserResponse)
  async bookRestaurant(
    @Arg('data') data: IUpdateRestaurantUserCapacity,
    @Arg('action') action: string,
    @PubSub('BOOKINGUPDATE') publish: Publisher<UpdateRestaurantUserResponse>,
  ): Promise<UpdateRestaurantUserResponse> {
    const response = await bookUpdate(data, action);
    await publish({ data: response.data, error: response.error, message: response.message });
    return response;
  }
}
