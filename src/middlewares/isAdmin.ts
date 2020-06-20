import { Context } from '@interfaces/Context.types';
import { MiddlewareFn } from 'type-graphql';

export const isAdmin: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.payload) {
    throw new Error('not admin');
  }
  if (context.payload.role !== 'admin') {
    throw new Error('not admin');
  }
  return next();
};
