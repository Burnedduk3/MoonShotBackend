import { Redis } from '@config/redis';
import { CONFIG_REDIS_REFRESH_TOKEN_PREFIX } from '@config/variables';
import { JwtToken } from '@utils/jwt';

export const redisCheckIfTokenExist = async (token: JwtToken): Promise<boolean> => {
  try {
    const isToken = await Redis().get(`${CONFIG_REDIS_REFRESH_TOKEN_PREFIX}|${token.phone}|${token.version}`);
    if (!isToken) throw new Error('no token in Redis');
    await Redis().del(`${CONFIG_REDIS_REFRESH_TOKEN_PREFIX}|${token.phone}|${token.version}`);
    return true;
  } catch (_e) {
    return false;
  }
};

export const redisSetRefreshTokenInDB = async (token: JwtToken, tokenInString: string): Promise<boolean> => {
  try {
    await Redis().set(`${CONFIG_REDIS_REFRESH_TOKEN_PREFIX}|${token.phone}|${token.version}`, tokenInString);
    return true;
  } catch (e) {
    return false;
  }
};
