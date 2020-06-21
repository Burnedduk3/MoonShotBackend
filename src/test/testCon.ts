import { createConnection } from 'typeorm';

export const testConn = (drop: boolean = false) => {
  return createConnection({
    name: 'default',
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'Admin',
    password: 'Admin1234!',
    database: 'moon_shot_test',
    synchronize: drop,
    dropSchema: drop,
    entities: [__dirname + '/../entities/*.*'],
  });
};
