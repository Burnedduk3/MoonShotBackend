import { Context } from '@interfaces/Context.types';
import { MiddlewareFn } from 'type-graphql';

export const isBusiness: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.payload) {
    throw new Error('not business');
  }
  if (context.payload.role !== 'business') {
    throw new Error('not business');
  }
  return next();
};
