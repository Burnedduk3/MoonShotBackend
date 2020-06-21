import { FieldResolver, Resolver } from 'type-graphql';
import { AdminRestaurantTypes } from './AdminRestaurant.types';

@Resolver(() => AdminRestaurantTypes)
export class AdminRestaurantResolver {
  @FieldResolver()
  crud(): AdminRestaurantTypes {
    return new AdminRestaurantTypes();
  }
}
