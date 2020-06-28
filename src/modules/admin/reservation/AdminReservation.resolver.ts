import { AdminReservationCrudTypes } from '@modules/admin/reservation/crud/AdminReservationCrud.types';
import { FieldResolver, Resolver } from 'type-graphql';
import { AdminReservationTypes } from './AdminReservation.types';

@Resolver(() => AdminReservationTypes)
export class AdminReservationResolver {
  @FieldResolver()
  crud(): AdminReservationCrudTypes {
    return new AdminReservationCrudTypes();
  }
}
