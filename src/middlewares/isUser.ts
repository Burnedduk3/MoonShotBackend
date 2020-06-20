import { Context } from '@interfaces/Context.types';
import { MiddlewareFn } from 'type-graphql';

export const isUser: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.payload) {
    throw new Error('not user');
  }
  if (context.payload.role !== 'user') {
    throw new Error('not user');
  }
  return next();
};
