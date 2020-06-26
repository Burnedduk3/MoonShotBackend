import { AdminRestaurantCrudTypes } from '@modules/admin/restaurants/crud/AdminRestaurantCrud.types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'UserTypes Types' })
export class AdminRestaurantTypes {
  @Field()
  crud: AdminRestaurantCrudTypes;
}
