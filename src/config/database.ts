import { ConnectionOptions, createConnection } from 'typeorm';
import { CONFIG_DATABASE_URL, CONFIG_ENVIROMENT } from './variables';

const config: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  url: CONFIG_DATABASE_URL,
  ssl: CONFIG_ENVIROMENT !== 'development' && {
    rejectUnauthorized: false,
  },
  synchronize: true,
  // logging: CONFIG_ENVIROMENT === 'development' ? true : false || false,
  entities: [
    'src/entities/Recipes.entity.ts',
    'src/entities/Reservation.entity.ts',
    'src/entities/Restaurant.entity.ts',
    'src/entities/User.entity.ts',
    'src/entities/UserRole.entity.ts',
    'src/entities/Companion.entity.ts',
  ],
};
export const getDBConfig = async () => await createConnection(config);
