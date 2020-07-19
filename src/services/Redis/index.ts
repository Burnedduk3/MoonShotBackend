import { Redis } from '@config/redis';
import { CONFIG_REDIS_REFRESH_TOKEN_PREFIX } from '@config/variables';
import { JwtToken } from '@utils/jwt';

export const redisCheckIfTokenExist = async (token: JwtToken): Promise<boolean> =>
  await new Promise((resolve, reject) => {
    Redis().hexists(`${CONFIG_REDIS_REFRESH_TOKEN_PREFIX}|${token.username}`, token.version!, (error, reply) => {
      if (error || reply === 0) {
        reject(false);
      }
      Redis().hdel(`${CONFIG_REDIS_REFRESH_TOKEN_PREFIX}|${token.username}`, token.version!, (error) => {
        if (error) reject(false);
        resolve(true);
      });
    });
  });

export const redisSetRefreshTokenInDB = async (token: JwtToken, tokenInString: string): Promise<boolean> =>
  await new Promise((resolve, reject) => {
    Redis().hmset(`${CONFIG_REDIS_REFRESH_TOKEN_PREFIX}|${token.username}`, token.version!, tokenInString, (error) => {
      if (error) reject(false);
      resolve(true);
    });
  });
