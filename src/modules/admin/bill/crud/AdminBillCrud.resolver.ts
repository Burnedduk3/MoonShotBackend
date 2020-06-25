import { Bill } from '@entities/Bill.entity';
import { updateBillHandler } from '@modules/admin/bill/crud/UpdateBillHandler';
import { updateBillRelationsHandler } from '@modules/admin/bill/crud/UpdateBillRelationsHandler';
import { Arg, FieldResolver, Resolver } from 'type-graphql';
import { AdminBillArrayCrudResponse, AdminBillCrudResponse, AdminBillCrudTypes } from './AdminBillCrud.types';
import { CrudBillUpdateInput, CrudBillUpdateRelationsInputs, CrudCreateBillInputs } from './CrudBill.inputs';

@Resolver(() => AdminBillCrudTypes)
export class AdminBillCrudResolver {
  @FieldResolver(/* istanbul ignore next */ () => AdminBillCrudTypes) // without args
  async updateBill(@Arg('id') id: number, @Arg('data') data: CrudBillUpdateInput): Promise<AdminBillCrudResponse> {
    return await updateBillHandler(id, data);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminBillCrudTypes)
  async updateBillRelations(
    @Arg('id') id: number,
    @Arg('data') data: CrudBillUpdateRelationsInputs,
    @Arg('action') action: string,
  ): Promise<AdminBillCrudResponse> {
    return await updateBillRelationsHandler(id, data, action);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminBillCrudTypes)
  async createBill(@Arg('data') data: CrudCreateBillInputs): Promise<AdminBillCrudResponse> {
    try {
      const recipe = await Bill.create({
        ...data,
      }).save();

      if (!recipe) throw new Error('Could not create recipe Role');

      return {
        error: false,
        data: recipe,
      };
    } catch (e) {
      /* istanbul ignore next */
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      }
      /* istanbul ignore next */
      return {
        error: true,
        message: 'Could Not Create recipe Role',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminBillCrudTypes)
  async deleteBill(@Arg('id') id: number): Promise<AdminBillCrudResponse> {
    try {
      await Bill.delete(id);

      return {
        error: false,
      };
    } catch (e) {
      /* istanbul ignore next */
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      }
      /* istanbul ignore next */
      return {
        error: true,
        message: 'Could Not delete recipe Role',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminBillCrudTypes)
  async getAllBills(): Promise<AdminBillArrayCrudResponse> {
    try {
      const bill = await Bill.find({ relations: ['restaurantMenu'] });

      if (!bill) throw new Error('No recipe Found');

      return {
        error: false,
        data: bill,
      };
    } catch (e) {
      /* istanbul ignore next */
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      }
      /* istanbul ignore next */
      return {
        error: true,
        message: 'No recipe Role Found',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminBillCrudTypes)
  async findBillById(@Arg('id') id: number): Promise<AdminBillCrudResponse> {
    try {
      const recipe = await Bill.findOne(id, { relations: ['restaurantMenu'] });

      if (!recipe) throw new Error('No recipe Role Found');

      return {
        error: false,
        data: recipe,
      };
    } catch (e) {
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      }
      /* istanbul ignore next */
      return {
        error: true,
        message: 'No recipe Found',
      };
    }
  }
}
