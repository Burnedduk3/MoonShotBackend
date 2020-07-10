import { CONFIG_TEST_DATABASE_URL } from '@config/variables';
import dotEnv from 'dotenv';
import { Connection, createConnection } from 'typeorm';

dotEnv.config();

let client: Connection | null;

export const testConn = async (drop: boolean = false): Promise<Connection> => {
  if (!client) {
    client = await createConnection({
      name: 'default',
      type: 'postgres',
      url: CONFIG_TEST_DATABASE_URL,
      ssl: false,
      synchronize: drop,
      dropSchema: drop,
      entities: [
        __dirname + '/../entities/Recipes.entity.ts',
        __dirname + '/../entities/Reservation.entity.ts',
        __dirname + '/../entities/Restaurant.entity.ts',
        __dirname + '/../entities/User.entity.ts',
        __dirname + '/../entities/UserRole.entity.ts',
      ],
    });
  }
  return client;
};
