import { Restaurant } from '@entities/Restaurant.entity';
import { isAuth } from '@middlewares/isAuth';
import { isUser } from '@middlewares/isUser';
import { deleteReservation } from '@modules/user/Mutations/DeleteReservation';
import { bookUpdate } from '@modules/user/Mutations/MakeReservation';
import { IDeleteReservation, IUpdateRestaurantUserCapacity } from '@modules/user/Mutations/User.inputs';
import {
  UpdateRestaurantUserResponse,
  UserMutationTypes,
  UserReservationResponse,
} from '@modules/user/Mutations/User.types';
import { Arg, FieldResolver, Mutation, Publisher, PubSub, Resolver, UseMiddleware } from 'type-graphql';

@Resolver(() => UserMutationTypes)
export class UserResolver {
  @Mutation(() => UserMutationTypes)
  @UseMiddleware([isAuth, isUser])
  user(): UserMutationTypes {
    return new UserMutationTypes();
  }

  @FieldResolver(() => UpdateRestaurantUserResponse)
  async makeReservation(
    @Arg('data') data: IUpdateRestaurantUserCapacity,
    @PubSub('BOOKINGUPDATE') publish: Publisher<UpdateRestaurantUserResponse>,
  ): Promise<UserReservationResponse> {
    try {
      const response = await bookUpdate(data);
      const restaurant = await Restaurant.findOne({ where: { restaurantIdentifier: data.restauranId } });
      if (!restaurant) throw new Error('No restaurant found');
      await publish({ data: restaurant, error: response.error, message: response.message });
      return response;
    } catch (e) {
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      } else {
        return {
          error: true,
          message: 'Restaurant not found',
        };
      }
    }
  }

  @FieldResolver(() => UpdateRestaurantUserResponse)
  async deleteReservation(
    @Arg('data') data: IDeleteReservation,
    @PubSub('BOOKINGUPDATE') publish: Publisher<UpdateRestaurantUserResponse>,
  ): Promise<UpdateRestaurantUserResponse> {
    try {
      const response = await deleteReservation(data);
      await publish({ data: response.data, error: response.error, message: response.message });
      return response;
    } catch (e) {
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      } else {
        return {
          error: true,
          message: 'Reservation not found',
        };
      }
    }
  }
}
