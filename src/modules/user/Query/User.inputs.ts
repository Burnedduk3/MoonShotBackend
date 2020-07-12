import { Field, InputType } from 'type-graphql';

@InputType()
export class IUpdateUserInputs {
  @Field({ nullable: true })
  firstName?: string;
  @Field({ nullable: true })
  secondName?: string;
  @Field({ nullable: true })
  firstLastname?: string;
  @Field({ nullable: true })
  secondLastname?: string;
}

@InputType()
export class IGetReservationById {
  @Field({ nullable: false })
  reservationId: string;
}

@InputType()
export class IGetRestaurantsInputs {
  @Field({ defaultValue: 0 })
  initialId: number;

  @Field({ defaultValue: '' })
  name: string;

  @Field({ defaultValue: '' })
  address: string;
}
