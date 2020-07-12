import { Restaurant } from '@entities/Restaurant.entity';
import { User } from '@entities/User.entity';
import { ICreateRestaurant } from '@modules/Business/Mutations/Business.inputs';
import { GeneralRestaurantBusinessResponse } from '@modules/Business/Mutations/Business.types';
import { getConnection } from 'typeorm';

export const CreateRestaurant = async (data: ICreateRestaurant): Promise<GeneralRestaurantBusinessResponse> => {
  try {
    const username = data.userOwner;
    const user = await User.findOne({ username }, { relations: ['role', 'restaurant'] });

    if (!user) throw new Error('No user was found to create Restaurant');

    const newRestaurant = await Restaurant.create({
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      maxCapacity: data.maxCapacity,
    }).save();

    if (!newRestaurant) throw new Error('Restaurant not created');

    await getConnection().createQueryBuilder().relation(Restaurant, 'owner').of(newRestaurant).set(user);
    newRestaurant.owner = user;

    return {
      error: false,
      data: newRestaurant,
    };
  } catch (error) {
    // istanbul ignore next
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
    /* istanbul ignore next */
    return {
      error: true,
      message: 'Could not create Restaurant',
    };
  }
};
