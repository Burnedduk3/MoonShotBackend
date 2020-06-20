import { ConnectionOptions, createConnection } from 'typeorm';
import { CONFIG_DATABASE_PROVIDER, CONFIG_DATABASE_URL, CONFIG_ENVIROMENT } from './variables';

const config: ConnectionOptions = {
  name: 'default',
  type: CONFIG_DATABASE_PROVIDER === 'postgres' ? 'postgres' : 'mysql',
  url: CONFIG_DATABASE_URL,
  ssl: CONFIG_ENVIROMENT !== 'development' && {
    rejectUnauthorized: false,
  },
  database: CONFIG_ENVIROMENT !== 'development' ? '' : 'moon_shot',

  synchronize: true,
  // logging: CONFIG_ENVIROMENT === 'development' ? true : false || false,
  entities: ['src/entities/*.*'],
};
export const getDBConfig = async () => await createConnection(config);
