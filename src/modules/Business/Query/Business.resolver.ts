import { isAuth } from '@middlewares/isAuth';
import { isBusiness } from '@middlewares/isBusiness';
import { RestaurantRecipesArrayBusinessResponse } from '@modules/Business/Mutations/Business.types';
import {IGetRestaurant, IGetRestaurantRecipesInput} from '@modules/Business/Query/Business.inputs';
import { Arg, FieldResolver, Query, Resolver, UseMiddleware } from 'type-graphql';
import {BusinessQueryTypes, ReservationsRestaurantBusinessResponse, RestaurantBusinessResponse} from './Business.types';
import { getRestaurant } from './GetMyRestaurant';
import { getRestaurantRecipes } from './GetRestaurantRecipes';
import { getRestaurantReservations } from './GetRestaurantReservations/index';

@Resolver(() => BusinessQueryTypes)
export class BusinessResolver {
  @Query(() => BusinessQueryTypes)
  @UseMiddleware([isAuth, isBusiness])
  Business(): BusinessQueryTypes {
    return new BusinessQueryTypes();
  }

  @FieldResolver(/* istanbul ignore next */ () => RestaurantRecipesArrayBusinessResponse)
  async getRestaurantRecipes(
    @Arg('data') data: IGetRestaurantRecipesInput,
  ): Promise<RestaurantRecipesArrayBusinessResponse> {
    return await getRestaurantRecipes(data);
  }

  @FieldResolver(/* istanbul ignore next */ () => ReservationsRestaurantBusinessResponse)
  async getRestaurantReservations(
    @Arg('data') data: IGetRestaurantRecipesInput,
  ): Promise<ReservationsRestaurantBusinessResponse> {
    return await getRestaurantReservations(data);
  }

  @FieldResolver(/* istanbul ignore next */ () => RestaurantBusinessResponse)
  async getMyRestaurant(@Arg('data') data: IGetRestaurant): Promise<RestaurantBusinessResponse> {
    return await getRestaurant(data);
  }
}
