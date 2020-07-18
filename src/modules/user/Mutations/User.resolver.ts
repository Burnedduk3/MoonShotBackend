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

@Resolver(/* istanbul ignore next */ () => UserMutationTypes)
export class UserResolver {
  @Mutation(() => UserMutationTypes)
  @UseMiddleware([isAuth, isUser])
  user(): UserMutationTypes {
    return new UserMutationTypes();
  }

  @FieldResolver(/* istanbul ignore next */ () => UpdateRestaurantUserResponse)
  async makeReservation(
    @Arg('data') data: IUpdateRestaurantUserCapacity,
    @PubSub('BOOKINGUPDATE') publish: Publisher<UpdateRestaurantUserResponse>,
  ): Promise<UserReservationResponse> {
    try {
      const response = await bookUpdate(data);

      if (response.data) {
        const minimumHour = new Date();
        minimumHour.setHours(new Date().getHours());
        minimumHour.setSeconds(0);
        minimumHour.setMinutes(0);
        minimumHour.setMilliseconds(0);

        const maximumHour = new Date();
        maximumHour.setHours(new Date().getHours() + 1);
        maximumHour.setSeconds(0);
        maximumHour.setMinutes(0);
        maximumHour.setMilliseconds(0);

        /* istanbul ignore next */
        if (data.date.getTime() > minimumHour.getTime() && data.date.getTime() < maximumHour.getTime()) {
          /* istanbul ignore next */
          await publish({ data: response.data?.restaurant, error: response.error });
        }
      }
      return response;
    } catch (e) {
      /* istanbul ignore next */
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      } else {
        /* istanbul ignore next */
        return {
          error: true,
          message: 'Restaurant not found',
        };
      }
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => UpdateRestaurantUserResponse)
  async deleteReservation(
    @Arg('data') data: IDeleteReservation,
    @PubSub('BOOKINGUPDATE') publish: Publisher<UpdateRestaurantUserResponse>,
  ): Promise<UpdateRestaurantUserResponse> {
    try {
      const response = await deleteReservation(data);
      /* istanbul ignore next */
      await publish({ data: response.data, error: response.error, message: response.message });
      return response;
    } catch (e) {
      /* istanbul ignore next */
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      } else {
        /* istanbul ignore next */
        return {
          error: true,
          message: 'Reservation not found',
        };
      }
    }
  }
}
