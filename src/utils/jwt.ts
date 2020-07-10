import { CONFIG_JWT_SECRET_ACCESS, CONFIG_JWT_SECRET_REFRESH } from '@config/variables';
import { Role } from '@interfaces/User.types';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

export interface JwtToken {
  username: string;
  version?: string;
  role: Role;
}

export interface JwtTokenFunc extends JwtToken {
  type: JwtActions;
}

type JwtActions = 'access' | 'refresh' | 'test';

interface IjwtDecodeInputs {
  token: string;
  type: JwtActions;
}

@ObjectType()
export class JwtTokens {
  @Field()
  accessToken: string;
  @Field()
  refreshToken: string;
}

export const jwtSign = async ({ username, type, version, role }: JwtTokenFunc): Promise<string | false> => {
  if (type === 'refresh')
    return jwt.sign({ username, version, role }, CONFIG_JWT_SECRET_REFRESH, {
      expiresIn: '1y',
    });
  if (type === 'access')
    return jwt.sign({ username, role }, CONFIG_JWT_SECRET_ACCESS, {
      expiresIn: '10m',
    });
  if (type === 'test') {
    return jwt.sign({ username, role }, CONFIG_JWT_SECRET_ACCESS, {
      expiresIn: '1y',
    });
  } else return false;
};

export const jwtDecodeToken = async ({ token, type }: IjwtDecodeInputs): Promise<JwtToken | string> => {
  try {
    if (!token) throw new Error('noToken');
    const decoded = await jwt.verify(token, type === 'access' ? CONFIG_JWT_SECRET_ACCESS : CONFIG_JWT_SECRET_REFRESH);
    if (typeof decoded === 'string') throw new Error('invalid token');

    return decoded as JwtToken;
  } catch (e) {
    return e.message;
  }
};

export const setTokenInCookies = async (res: Response, token: string, type: JwtActions): Promise<void> => {
  await res.cookie(type === 'access' ? 'access-token' : 'refresh-token', token, {
    httpOnly: true,
  });
};
