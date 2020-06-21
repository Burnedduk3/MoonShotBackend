import { Restaurant } from '@entities/Restaurant.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Admin Restaurant CRUD types response' })
export class AdminRestaurantCrudResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => Restaurant, { nullable: true })
  data?: Restaurant;
}

@ObjectType({ description: 'admin Restaurant CRUD types response' })
export class AdminRestaurantArrayCrudResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [Restaurant], { nullable: true })
  data?: Restaurant[];
}

@ObjectType({ description: 'admin Restaurant CRUD types' })
export class AdminRestaurantCrudTypes {
  @Field(() => AdminRestaurantCrudResponse, { nullable: true })
  updateRestaurant: AdminRestaurantCrudResponse;

  @Field(() => AdminRestaurantCrudResponse, { nullable: true })
  updateRestaurantRelations: AdminRestaurantCrudResponse;

  @Field(() => AdminRestaurantCrudResponse, { nullable: true })
  createRestaurant: AdminRestaurantCrudResponse;

  @Field(() => AdminRestaurantCrudResponse, { nullable: true })
  deleteRestaurant: AdminRestaurantCrudResponse;

  @Field(() => AdminRestaurantArrayCrudResponse, { nullable: true })
  getAllRestaurant: AdminRestaurantArrayCrudResponse;

  @Field(() => AdminRestaurantCrudResponse, { nullable: true })
  findRestaurantById: AdminRestaurantCrudResponse;
}
