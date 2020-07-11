import { Reservation } from '@entities/Reservation.entity';
import { updateReservationHandler } from '@modules/admin/reservation/crud/UpdateReservationHandler';
import { UpdateReservationRelationsHandler } from '@modules/admin/reservation/crud/UpdateReservationRelationHandler';
import { Arg, FieldResolver, Resolver } from 'type-graphql';
import {
  AdminReservationArrayCrudResponse,
  AdminReservationCrudResponse,
  AdminReservationCrudTypes,
} from './AdminReservationCrud.types';
import {
  CrudCreateReservationInputs,
  CrudReservationUpdateInput,
  CrudReservationUpdateRelationsInputs,
} from './CrudReservation.inputs';

@Resolver(/* istanbul ignore next */ () => AdminReservationCrudTypes)
export class AdminReservationCrudResolver {
  @FieldResolver(/* istanbul ignore next */ () => AdminReservationCrudResponse) // without args
  async updateReservation(
    @Arg('id') id: number,
    @Arg('data') data: CrudReservationUpdateInput,
  ): Promise<AdminReservationCrudResponse> {
    return await updateReservationHandler(id, data);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminReservationCrudResponse)
  async updateRelationReservation(
    @Arg('id') id: number,
    @Arg('data') data: CrudReservationUpdateRelationsInputs,
  ): Promise<AdminReservationCrudResponse> {
    return await UpdateReservationRelationsHandler(id, data);
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminReservationCrudResponse)
  async createReservation(@Arg('data') data: CrudCreateReservationInputs): Promise<AdminReservationCrudResponse> {
    try {
      const date = data.date;
      const reservation = await Reservation.create({
        reservationTime: date,
        peopleQuantities: data.peopleQuantities,
      }).save();

      if (!reservation) throw new Error('Could not create restaurant Role');
      return {
        error: false,
        data: reservation,
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
        message: 'Could Not Create reservation Role',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminReservationCrudResponse)
  async deleteReservation(@Arg('id') id: number): Promise<AdminReservationCrudResponse> {
    try {
      const reservation = await Reservation.findOne(id);
      if (!reservation) throw new Error('Reservation does not exist');

      await Reservation.delete(id);

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
        message: 'Could Not delete restaurant Role',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminReservationArrayCrudResponse)
  async getAllReservation(): Promise<AdminReservationArrayCrudResponse> {
    try {
      const reservation = await Reservation.find({ relations: ['owner', 'restaurant'] });

      if (!reservation) throw new Error('No restaurant Role Found');

      return {
        error: false,
        data: reservation,
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
        message: 'No restaurant Role Found',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => AdminReservationCrudResponse)
  async findReservationById(@Arg('id') id: number): Promise<AdminReservationCrudResponse> {
    try {
      const reservation = await Reservation.findOne(id, { relations: ['owner', 'restaurant'] });
      if (!reservation) throw new Error('No restaurant Role Found');

      return {
        error: false,
        data: reservation,
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
        message: 'No restaurant Found',
      };
    }
  }
}
