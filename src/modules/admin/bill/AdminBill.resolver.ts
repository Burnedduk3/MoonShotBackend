import { FieldResolver, Resolver } from 'type-graphql';
import { AdminBillTypes } from './AdminBill.types';

@Resolver(() => AdminBillTypes)
export class AdminBillResolver {
  @FieldResolver()
  crud(): AdminBillTypes {
    return new AdminBillTypes();
  }
}
