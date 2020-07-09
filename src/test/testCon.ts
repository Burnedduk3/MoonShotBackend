import dotEnv from 'dotenv';

dotEnv.config();

import { Connection, createConnection } from 'typeorm';

let client: Connection | null;

export const testConn = async (drop: boolean = false): Promise<Connection> => {
  if (!client) {
    client = await createConnection({
      name: 'default',
      type: process.env.DATABASE_PROVIDER === 'postgres' ? 'postgres' : 'mysql',
      url: process.env.TESTDATABASE_URL,
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
