import { Field, InputType } from 'type-graphql';

@InputType()
export class IUpdateRestaurantCapacity {
  @Field({ nullable: true })
  restaurantId: string;
}

@InputType()
export class ICreateRestaurant {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  address: string;

  @Field({ nullable: false })
  phoneNumber: string;

  @Field({ nullable: false })
  maxCapacity: number;

  @Field({ nullable: false })
  userOwner: string; // username
}

@InputType()
export class IUpdateRestaurant {
  @Field({ nullable: false })
  name?: string;

  @Field({ nullable: false })
  address?: string;

  @Field({ nullable: false })
  phoneNumber?: string;

  @Field({ nullable: false })
  maxCapacity?: number;
}

@InputType()
export class IUpdateRecipe {
  @Field({ nullable: false })
  name?: string;

  @Field({ nullable: false })
  price?: number;

  @Field({ nullable: false })
  description?: string;

  @Field({ nullable: false })
  recipeCategory?: string;
}

@InputType()
export class IAddCompanion {
  @Field({ nullable: false })
  userID: string;

  @Field({ nullable: false })
  phone: string;

  @Field({ nullable: false })
  completeName: string;

  @Field({ nullable: false })
  address: string;
}

@InputType()
export class IUpdateMenu {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  price: number;

  @Field({ nullable: false })
  description: string;

  @Field({ nullable: false })
  recipeCategory: string;

  @Field({ nullable: true })
  recipeIdentifier?: string;
}
