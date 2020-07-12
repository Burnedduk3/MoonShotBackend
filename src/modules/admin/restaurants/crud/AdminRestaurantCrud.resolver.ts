import { Restaurant } from '@entities/Restaurant.entity';
import { updateRestaurantHandler } from '@modules/admin/restaurants/crud/UpdateRestaurantHandler';
import { updateRestaurantRelationsHandler } from '@modules/admin/restaurants/crud/UpdateRestaurantRelationsHandler';
import { Arg, FieldResolver, Resolver } from 'type-graphql';
import {
  AdminRestaurantArrayCrudResponse,
  AdminRestaurantCrudResponse,
  AdminRestaurantCrudTypes,
} from './AdminRestaurantCrud.types';
import {
  CrudCreateRestaurantInputs,
  CrudRestaurantUpdateInput,
  CrudRestaurantUpdateRelationsInputs,
} from './CrudRestaurant.inputs';

@Resolver(() => AdminRestaurantCrudTypes)
export class AdminRestaurantCrudResolver {
  @FieldResolver(/* istanbul ignore next */ () => AdminRestaurantCrudTypes) // without args
  async updateRestaurant(
    @Arg('id') id: number,
    @Arg('data') data: CrudRestaurantUpdateInput,
  ): Promise<AdminRestaurantCrudResponse> {
    return await updateRestaurantHandler(id, data);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminRestaurantCrudTypes)
  async updateRestaurantRelations(
    @Arg('id') id: number,
    @Arg('data') data: CrudRestaurantUpdateRelationsInputs,
    @Arg('action') action: string,
  ): Promise<AdminRestaurantCrudResponse> {
    return await updateRestaurantRelationsHandler(id, data, action);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminRestaurantCrudTypes)
  async createRestaurant(@Arg('data') data: CrudCreateRestaurantInputs): Promise<AdminRestaurantCrudResponse> {
    try {
      const restaurant = await Restaurant.create({
        ...data,
      }).save();

      if (!restaurant) throw new Error('Could not create restaurant Role');

      return {
        error: false,
        data: restaurant,
      };
    } catch (e) {
      /* istanbul ignore next */
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      }
      /* istanbul ignore next */
      return {
        error: true,
        message: 'Could Not Create restaurant Role',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminRestaurantCrudTypes)
  async deleteRestaurant(@Arg('id') id: number): Promise<AdminRestaurantCrudResponse> {
    try {
      const restaurant = await Restaurant.findOne(id);

      if (!restaurant) throw new Error('Restaurant not found');
      await Restaurant.delete(id);

      return {
        error: false,
      };
    } catch (e) {
      /* istanbul ignore next */
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      }
      /* istanbul ignore next */
      return {
        error: true,
        message: 'Could Not delete restaurant Role',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminRestaurantCrudTypes)
  async getAllRestaurant(): Promise<AdminRestaurantArrayCrudResponse> {
    try {
      const restaurants = await Restaurant.find({ relations: ['owner', 'recipes'] });

      if (!restaurants) throw new Error('No restaurant Role Found');

      return {
        error: false,
        data: restaurants,
      };
    } catch (e) {
      /* istanbul ignore next */
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      }
      /* istanbul ignore next */
      return {
        error: true,
        message: 'No restaurant Role Found',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminRestaurantCrudTypes)
  async findRestaurantById(@Arg('id') id: number): Promise<AdminRestaurantCrudResponse> {
    try {
      const restaurant = await Restaurant.findOne(id, { relations: ['owner', 'recipes'] });

      if (!restaurant) throw new Error('No restaurant Role Found');

      return {
        error: false,
        data: restaurant,
      };
    } catch (e) {
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      }
      /* istanbul ignore next */
      return {
        error: true,
        message: 'No restaurant Role Found',
      };
    }
  }
}
