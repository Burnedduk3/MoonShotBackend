import { Bill } from '@entities/Bill.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Admin Bill CRUD types response' })
export class AdminBillCrudResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => Bill, { nullable: true })
  data?: Bill;
}

@ObjectType({ description: 'admin Bill CRUD types response' })
export class AdminBillArrayCrudResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [Bill], { nullable: true })
  data?: Bill[];
}

@ObjectType({ description: 'admin Bill CRUD types' })
export class AdminBillCrudTypes {
  @Field(() => AdminBillCrudResponse, { nullable: true })
  updateBill: AdminBillCrudResponse;

  @Field(() => AdminBillCrudResponse, { nullable: true })
  updateBillRelations: AdminBillCrudResponse;

  @Field(() => AdminBillCrudResponse, { nullable: true })
  createBill: AdminBillCrudResponse;

  @Field(() => AdminBillCrudResponse, { nullable: true })
  deleteBill: AdminBillCrudResponse;

  @Field(() => AdminBillArrayCrudResponse, { nullable: true })
  getAllBills: AdminBillArrayCrudResponse;

  @Field(() => AdminBillCrudResponse, { nullable: true })
  findBillById: AdminBillCrudResponse;
}
