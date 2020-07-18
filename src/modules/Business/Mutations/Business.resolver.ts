import { isAuth } from '@middlewares/isAuth';
import { isBusiness } from '@middlewares/isBusiness';
import {
  IAddCompanion,
  ICreateRestaurant,
  IUpdateMenu,
  IUpdateRecipe,
  IUpdateRestaurant,
  IUpdateRestaurantCapacity,
} from '@modules/Business/Mutations/Business.inputs';
import {
  AddCompanionResponse,
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
import { addCompanion } from './AddCompanion';

@Resolver(() => BusinessTypes)
export class BusinessResolver {
  @Mutation(() => BusinessTypes)
  @UseMiddleware([isAuth])
  business(): BusinessTypes {
    return new BusinessTypes();
  }

  // istanbul ignore next
  @Subscription(() => GeneralRestaurantBusinessResponse, {
    topics: 'BOOKINGUPDATE',
    filter: ({ payload, args }) => {
      // istanbul ignore next
      if (payload.data && payload.data.restaurantIdentifier) {
        return payload.data.restaurantIdentifier === args.restaurantID;
      }
      // istanbul ignore next
      return false;
    },
  })
  async BookingNotification(
    @Root() notificationPayload: GeneralRestaurantBusinessResponse,
    @Arg('restaurantID') _restaurantId: string,
  ): Promise<GeneralRestaurantBusinessResponse> {
    try {
      if (notificationPayload.error) throw new Error('Restaurant Not Found');

      return {
        error: false,
        data: notificationPayload.data,
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
  @UseMiddleware([isBusiness])
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
  @UseMiddleware([isBusiness])
  async createRestaurant(@Arg('data') data: ICreateRestaurant): Promise<GeneralRestaurantBusinessResponse> {
    return await CreateRestaurant(data);
  }

  @FieldResolver()
  @UseMiddleware([isBusiness])
  async updateRestaurantInfo(
    @Arg('data') data: IUpdateRestaurant,
    @Arg('restaurantId') restauranId: string,
  ): Promise<GeneralRestaurantBusinessResponse> {
    return await UpdateRestaurantInfo(data, restauranId);
  }

  @FieldResolver()
  @UseMiddleware([isBusiness])
  async updateMenu(
    @Arg('restaurantId') restauranId: string,
    @Arg('data') data: IUpdateMenu,
    @Arg('action') action: string,
  ): Promise<GeneralRestaurantBusinessResponse> {
    return await UpdateMenu(data, restauranId, action);
  }

  @FieldResolver()
  @UseMiddleware([isBusiness])
  async updateRecipe(
    @Arg('recipeId') recipeId: string,
    @Arg('data') data: IUpdateRecipe,
  ): Promise<RestaurantRecipesBusinessResponse> {
    return await UpdateRecipe(data, recipeId);
  }

  @FieldResolver()
  async addCompanion(
    @Arg('reservationId') reservationId: string,
    @Arg('data') data: IAddCompanion,
  ): Promise<AddCompanionResponse> {
    return await addCompanion(data, reservationId);
  }
}
