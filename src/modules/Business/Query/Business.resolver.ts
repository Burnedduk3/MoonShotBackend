import { isAuth } from '@middlewares/isAuth';
import { isBusiness } from '@middlewares/isBusiness';
import {
  GeneralRestaurantArrayBusinessResponse,
  RestaurantRecipesArrayBusinessResponse,
} from '@modules/Business/Mutations/Business.types';
import { IGetMyRestaurantInput, IGetRestaurantRecipesInput } from '@modules/Business/Query/Business.inputs';
import { getMyRestaurants } from '@modules/Business/Query/GetMyRestaurants';
import { Arg, FieldResolver, Query, Resolver, UseMiddleware } from 'type-graphql';
import { BusinessQueryTypes, ReservationsRestaurantBusinessResponse } from './Business.types';
import { getRestaurantRecipes } from './GetRestaurantRecipes';
import { getRestaurantReservations } from './GetRestaurantReservations/index';

@Resolver(() => BusinessQueryTypes)
export class BusinessResolver {
  @Query(() => BusinessQueryTypes)
  @UseMiddleware([isAuth, isBusiness])
  Business(): BusinessQueryTypes {
    return new BusinessQueryTypes();
  }

  @FieldResolver()
  async getMyRestaurants(@Arg('data') data: IGetMyRestaurantInput): Promise<GeneralRestaurantArrayBusinessResponse> {
    return await getMyRestaurants(data);
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
}
