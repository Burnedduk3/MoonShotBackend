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
    context.payload = { role: accessTokenPayload.role, phone: accessTokenPayload.phone };
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message);
    else throw new Error('Auth error');
  }
  return next();

  // try {
  //   console.log(context.req.headers.authorization);
  //   const token = context.req.cookies['access-token'];
  //   if (!token) throw new Error('not authenticated');
  //   const payload = await jwtDecodeToken({ token, type: 'access' });
  //   if (typeof payload === 'string') throw new Error('access token no valid');

  //   if (!payload.role) throw new Error('no role provided in token');
  //   context.payload = { role: payload.role, phone: payload.phone };
  // } catch (error) {
  //   try {
  //     const refreshToken = context.req.cookies['refresh-token'];
  //     if (!refreshToken) throw new Error('no refresh token provided');
  //     const decodedRefreshToken = await jwtDecodeToken({
  //       token: refreshToken,
  //       type: 'refresh',
  //     });
  //     if (typeof decodedRefreshToken === 'string') throw new Error('no valid refresh token');

  //     const user = await User.findOne(
  //       {
  //         phone: decodedRefreshToken.phone,
  //       },
  //       { relations: ['role'] },
  //     );
  //     if (!user) throw new Error('no authenticated');

  //     if (user.tokenVersion !== decodedRefreshToken.version) throw new Error('no authenticated');

  //     await User.update({ phone: user.phone }, { tokenVersion: user.tokenVersion + 1 });
  //     const newAccessToken = await jwtSign({
  //       phone: user.phone,
  //       type: 'access',
  //       role: user.role.name as Role,
  //     });
  //     const newRefreshToken = await jwtSign({
  //       phone: user.phone,
  //       version: user.tokenVersion + 1,
  //       type: 'refresh',
  //     });
  //     if (newAccessToken === false || newRefreshToken === false) throw new Error('error sign token');

  //     await setTokenInCookies(context.res, newAccessToken, 'access');
  //     await setTokenInCookies(context.res, newRefreshToken, 'refresh');
  //     context.payload = { role: user.role.name as Role, phone: user.phone };
  //   } catch (e) {
  //     throw new Error('no authenticated');
  //   }
  // }
  // return next();
};
