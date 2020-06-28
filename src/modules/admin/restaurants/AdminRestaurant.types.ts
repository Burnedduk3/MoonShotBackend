import { AdminRestaurantCrudTypes } from '@modules/admin/restaurants/crud/AdminRestaurantCrud.types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'BusinessTypes Types' })
export class AdminRestaurantTypes {
  @Field()
  crud: AdminRestaurantCrudTypes;
}
