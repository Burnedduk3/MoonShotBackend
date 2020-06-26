import { FieldResolver, Resolver } from 'type-graphql';
import { AdminReservationTypes } from './AdminReservation.types';

@Resolver(() => AdminReservationTypes)
export class AdminReservationResolver {
  @FieldResolver()
  crud(): AdminReservationTypes {
    return new AdminReservationTypes();
  }
}
