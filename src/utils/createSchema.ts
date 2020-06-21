import { buildSchema } from 'type-graphql';

export const createSchema = () =>
  buildSchema({
    resolvers: [__dirname + '/../modules/**/*.resolver.ts'],
    dateScalarMode: 'isoDate',
    validate: false,
  });
