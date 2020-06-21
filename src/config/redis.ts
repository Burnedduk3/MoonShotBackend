import { CONFIG_REDIS_HOST, CONFIG_REDIS_PASSWORD, CONFIG_REDIS_PORT } from '@config/variables';
import { Tedis } from 'tedis';

const redisClient: Tedis | null = null;

export const Redis = (): Tedis => {
  const client = redisClient
    ? redisClient
    : new Tedis({
        host: CONFIG_REDIS_HOST,
        port: CONFIG_REDIS_PORT,
        password: CONFIG_REDIS_PASSWORD,
      });
  return client;
};
