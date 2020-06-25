import { Role } from '@interfaces/User.types';
import { redisCheckIfTokenExist, redisSetRefreshTokenInDB } from '@services/Redis';
import { jwtDecodeToken, jwtSign } from '@utils/jwt';
import { makeRandomString } from '@utils/strings';
import { IRefreshTokenInputs } from './login/Login.inputs';
import { NewTokensResponse } from './login/Login.types';

export const refreshTokenHandler = async ({ refreshToken }: IRefreshTokenInputs): Promise<NewTokensResponse> => {
  try {
    const decodedToken = await jwtDecodeToken({ token: refreshToken, type: 'refresh' });

    if (typeof decodedToken === 'string') throw new Error(decodedToken);
    const checkifTokenInCache = await redisCheckIfTokenExist(decodedToken);
    if (!checkifTokenInCache) throw new Error('No token in DB');

    const newAccessToken = await jwtSign({
      type: 'access',
      username: decodedToken.username,
      role: decodedToken.role as Role,
    });
    if (typeof newAccessToken !== 'string') throw new Error('Error creating access token');

    const newTokenVersion = makeRandomString();
    const newRefreshToken = await jwtSign({
      type: 'refresh',
      username: decodedToken.username,
      version: newTokenVersion,
      role: decodedToken.role as Role,
    });
    if (typeof newRefreshToken !== 'string') throw new Error('Error creating refresh token');
    const tokens = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
    await redisSetRefreshTokenInDB(
      {
        username: decodedToken.username,
        version: newTokenVersion,
        role: decodedToken.role as Role,
      },
      newRefreshToken,
    );
    return {
      error: false,
      data: tokens,
    };
  } catch (e) {
    if (e instanceof Error)
      return {
        error: true,
        message: e.message,
      };
    // istanbul ignore next
    else {
      return {
        error: true,
        message: 'Invalid token',
      };
    }
  }
};
