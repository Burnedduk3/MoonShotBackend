import { CONFIG_REDIS_HOST, CONFIG_REDIS_PASSWORD, CONFIG_REDIS_PORT } from '@config/variables';
import redis, { RedisClient } from 'redis';

let client: RedisClient | null;

export const Redis = (): RedisClient => {
  if (!client) {
    client = redis.createClient({ host: CONFIG_REDIS_HOST, port: CONFIG_REDIS_PORT, password: CONFIG_REDIS_PASSWORD });
  }
  return client;
};
