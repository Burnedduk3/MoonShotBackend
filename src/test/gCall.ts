import { createSchema } from '@utils/createSchema';
import { graphql, GraphQLSchema } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userId?: number;
  type?: string;
  accessToken?: string;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues, userId, type, accessToken }: Options) => {
  schema = await createSchema();

  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        headers: { authorization: `Bearer ${accessToken}` },
      },
      payload: {
        userId,
        type,
      },
      res: {
        cookie: jest.fn(),
      },
    },
  });
};

