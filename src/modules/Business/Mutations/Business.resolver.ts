import { Restaurant } from '@entities/Restaurant.entity';
import { isAuth } from '@middlewares/isAuth';
import { isBusiness } from '@middlewares/isBusiness';
import {
  ICreateRestaurant,
  IUpdateMenu,
  IUpdateRecipe,
  IUpdateRestaurant,
  IUpdateRestaurantCapacity,
} from '@modules/Business/Mutations/Business.inputs';
import {
  BusinessTypes,
  GeneralRestaurantBusinessResponse,
  RestaurantRecipesBusinessResponse,
} from '@modules/Business/Mutations/Business.types';
import { CreateRestaurant } from '@modules/Business/Mutations/CreateRestaurant';
import { updateCapacity } from '@modules/Business/Mutations/UpdateCapacity';
import { UpdateMenu } from '@modules/Business/Mutations/UpdateMenu';
import { UpdateRecipe } from '@modules/Business/Mutations/UpdateRecipe';
import { UpdateRestaurantInfo } from '@modules/Business/Mutations/UpdateRestaurant';
import {
  Arg,
  FieldResolver,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from 'type-graphql';

@Resolver(() => BusinessTypes)
export class BusinessResolver {
  @Mutation(() => BusinessTypes)
  @UseMiddleware([isAuth, isBusiness])
  business(): BusinessTypes {
    return new BusinessTypes();
  }

  @Subscription(() => GeneralRestaurantBusinessResponse, {
    topics: 'BOOKINGUPDATE',
    filter: ({ payload, args }) => {
      if (payload.data && payload.data.restaurantIdentifier) {
        return payload.data.restaurantIdentifier === args.restaurantID;
      }
      return false;
    },
  })
  async BookingNotification(
    @Root() notificationPayload: GeneralRestaurantBusinessResponse,
    @Arg('restaurantID') _restaurantId: string,
  ): Promise<GeneralRestaurantBusinessResponse> {
    try {
      if (notificationPayload.error) throw new Error('Restaurant Not Found');

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
    @PubSub('BOOKINGUPDATE') publish: Publisher<GeneralRestaurantBusinessResponse>,
  ): Promise<GeneralRestaurantBusinessResponse> {
    const response = await updateCapacity(data, action);
    await publish({ data: response.data, error: response.error });
    return response;
  }

  @FieldResolver()
  async createRestaurant(@Arg('data') data: ICreateRestaurant): Promise<GeneralRestaurantBusinessResponse> {
    return await CreateRestaurant(data);
  }

  @FieldResolver()
  async updateRestaurantInfo(
    @Arg('data') data: IUpdateRestaurant,
    @Arg('restaurantId') restauranId: string,
  ): Promise<GeneralRestaurantBusinessResponse> {
    return await UpdateRestaurantInfo(data, restauranId);
  }

  @FieldResolver()
  async updateMenu(
    @Arg('restaurantId') restauranId: string,
    @Arg('data') data: IUpdateMenu,
    @Arg('action') action: string,
  ): Promise<GeneralRestaurantBusinessResponse> {
    return await UpdateMenu(data, restauranId, action);
  }

  @FieldResolver()
  async updateRecipe(
    @Arg('recipeId') recipeId: string,
    @Arg('data') data: IUpdateRecipe,
  ): Promise<RestaurantRecipesBusinessResponse> {
    return await UpdateRecipe(data, recipeId);
  }
}
