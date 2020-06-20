import { createConnection } from 'typeorm';

export const testConn = (drop: boolean = false) => {
  return createConnection({
    name: 'default',
    type: 'mysql',
    host: '186.155.211.216',
    port: 33,
    username: 'micoleDevTestUserOne',
    password: 'micoleDevUserTestPassword2894234',
    database: 'micoleDevTest',
    synchronize: drop,
    dropSchema: drop,
    entities: [__dirname + '/../entities/*.*'],
  });
};
