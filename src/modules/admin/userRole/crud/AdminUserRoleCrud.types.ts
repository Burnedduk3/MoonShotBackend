import { UserRole } from '@entities/UserRole.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'admin Lawyer Category CRUD types response' })
export class AdminUserRoleCrudResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => UserRole, { nullable: true })
  data?: UserRole;
}

@ObjectType({ description: 'admin Lawyer Category CRUD types response' })
export class AdminUserRoleArrayCrudResponse {
  @Field()
  error: boolean;
  @Field({ nullable: true })
  message?: string;
  @Field(/* istanbul ignore next */ () => [UserRole], { nullable: true })
  data?: UserRole[];
}

@ObjectType({ description: 'admin user Role CRUD types' })
export class AdminUserRoleCrudTypes {
  @Field(() => AdminUserRoleCrudResponse, { nullable: true })
  updateUserRole: AdminUserRoleCrudResponse;

  @Field(() => AdminUserRoleCrudResponse, { nullable: true })
  updateUserRoleRelations: AdminUserRoleCrudResponse;

  @Field(() => AdminUserRoleCrudResponse, { nullable: true })
  createUserRole: AdminUserRoleCrudResponse;

  @Field(() => AdminUserRoleCrudResponse, { nullable: true })
  deleteUserRole: AdminUserRoleCrudResponse;

  @Field(() => AdminUserRoleArrayCrudResponse, { nullable: true })
  getAllUserRole: AdminUserRoleArrayCrudResponse;

  @Field(() => AdminUserRoleCrudResponse, { nullable: true })
  findUserRoleById: AdminUserRoleCrudResponse;
}
