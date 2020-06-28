import { CONFIG_SERVER_PORT } from '@config/variables';
import { createSchema } from '@utils/createSchema';
import { boilerplateData, connectSqlDB } from '@utils/setupdevDB';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import logger from './utils/logger';
import {createServer} from "http";

export const server = express();
export const runServer = async () => {
  await connectSqlDB();
  await boilerplateData();
  const schema = await createSchema();
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({
      req,
      res,
    }),
    introspection: true,
    playground: true,
    formatError: (error) => {
      return error;
    },
  });

  const httpServer = createServer(server);

  apolloServer.installSubscriptionHandlers(httpServer)
  server.use(cookieParser());
  server.use(cors());
  server.get('/', (_req, res) => res.send('Hello From MoonShot Server'));
  apolloServer.applyMiddleware({ app: server });
  httpServer.listen(CONFIG_SERVER_PORT, () => {
    logger.info(`Server Started at ${CONFIG_SERVER_PORT}`);
  });
};
