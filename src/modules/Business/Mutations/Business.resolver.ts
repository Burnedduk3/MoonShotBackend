import { Restaurant } from '@entities/Restaurant.entity';
import { IUpdateRestaurantCapacity } from '@modules/Business/Mutations/Business.inputs';
import { BusinessTypes, UpdateRestaurantCrudResponse } from '@modules/Business/Mutations/Business.types';
import { updateCapacity } from '@modules/Business/Mutations/UpdateCapacity';
import { Arg, FieldResolver, Mutation, Publisher, PubSub, Resolver, Root, Subscription } from 'type-graphql';

@Resolver(() => BusinessTypes)
export class BusinessResolver {
  @Mutation(() => BusinessTypes)
  // @UseMiddleware([isAuth, isBusiness])
  business(): BusinessTypes {
    return new BusinessTypes();
  }

  @Subscription(() => UpdateRestaurantCrudResponse, {
    topics: 'BOOKINGUPDATE',
  })
  async BookingNotification(
    @Root() notificationPayload: UpdateRestaurantCrudResponse,
  ): Promise<UpdateRestaurantCrudResponse> {
    try {
      const restaurant = await Restaurant.findOne(notificationPayload.data?.id);

      if (!restaurant) throw new Error('No restaurant found');

      return {
        error: false,
        data: restaurant,
      };
    } catch (e) {
      if (e instanceof Error) {
        return {
          error: false,
          message: e.message,
        };
      }

      return {
        error: false,
        message: 'Subscription failed',
      };
    }
  }

  @FieldResolver()
  // @UseMiddleware(isAuth)
  async updateCapacity(
    @Arg('data') data: IUpdateRestaurantCapacity,
    @Arg('action') action: string,
    @PubSub('BOOKINGUPDATE') publish: Publisher<UpdateRestaurantCrudResponse>,
  ): Promise<UpdateRestaurantCrudResponse> {
    const response = await updateCapacity(data, action);
    await publish({ data: response.data, error: response.error, message: response.message });
    return response;
  }
}
