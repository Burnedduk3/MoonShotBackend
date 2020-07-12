import { Context } from '@interfaces/Context.types';
import { jwtDecodeToken } from '@utils/jwt';
import { MiddlewareFn } from 'type-graphql';

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  try {
    const accessTokenInHeader = context.req.headers.authorization;
    if (!accessTokenInHeader) throw new Error('No authenticated');
    const accessToken = accessTokenInHeader.substr(7);
    const accessTokenPayload = await jwtDecodeToken({ token: accessToken, type: 'access' });
    if (typeof accessTokenPayload === 'string') throw new Error('access token no valid');
    if (!accessTokenPayload.role) throw new Error('no role provided in token');
    context.payload = { role: accessTokenPayload.role, username: accessTokenPayload.username };
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message);
    else throw new Error('Auth error');
  }
  return next();
};
