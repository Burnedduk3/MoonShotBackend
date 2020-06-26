import {
  GeneralRestaurantArrayBusinessResponse,
  RestaurantRecipesArrayBusinessResponse,
} from '@modules/Business/Mutations/Business.types';
import { IGetMyRestaurantInput, IGetRestaurantRecipesInput } from '@modules/Business/Query/Business.inputs';
import { getMyRestaurants } from '@modules/Business/Query/GetMyRestaurants';
import { Arg, FieldResolver, Query, Resolver } from 'type-graphql';
import { BusinessQueryTypes } from './Business.types';
import { getRestaurantRecipes } from './GetRestaurantRecipes';

@Resolver(() => BusinessQueryTypes)
export class BusinessResolver {
  @Query(() => BusinessQueryTypes)
  Business(): BusinessQueryTypes {
    return new BusinessQueryTypes();
  }

  @FieldResolver()
  async getMyRestaurants(@Arg('data') data: IGetMyRestaurantInput): Promise<GeneralRestaurantArrayBusinessResponse> {
    return await getMyRestaurants(data);
  }

  @FieldResolver(() => RestaurantRecipesArrayBusinessResponse)
  async getRestaurantRecipes(
    @Arg('data') data: IGetRestaurantRecipesInput,
  ): Promise<RestaurantRecipesArrayBusinessResponse> {
    return await getRestaurantRecipes(data);
  }
}
