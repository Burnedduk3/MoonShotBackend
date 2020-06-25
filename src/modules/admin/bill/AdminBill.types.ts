import { AdminBillCrudTypes } from '@modules/admin/bill/crud/AdminBillCrud.types';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'User Types' })
export class AdminBillTypes {
  @Field()
  crud: AdminBillCrudTypes;
}
