import { User } from '@entities/User.entity';
import { Role } from '@interfaces/User.types';
import { redisSetRefreshTokenInDB } from '@services/Redis';
import { jwtSign, JwtTokens } from '@utils/jwt';
import { makeRandomString } from '@utils/strings';
import * as bcyrpt from 'bcrypt';
import { Arg, FieldResolver, Resolver } from 'type-graphql';
import { CheckCodeResoleverInputs, LoginResolverInputs } from './Login.inputs';
import { LoginResponse, LoginTypes, NewTokensResponse } from './Login.types';

@Resolver(() => LoginTypes)
export class LoginResolver {
  @FieldResolver(/* istanbul ignore next */ () => User)
  async loginWithUsernameAndPassword(@Arg('data') data: LoginResolverInputs): Promise<LoginResponse> {
    try {
      const user = await User.findOne({ username: data.username }, { relations: ['role'] });

      if (!user) {
        throw new Error('User not exist');
      }

      if (!(await bcyrpt.compare(data.password, user.password))) throw new Error('Password not match');

      const tokenVersion = makeRandomString();
      const refreshToken = await jwtSign({
        type: 'refresh',
        username: user.username,
        version: tokenVersion,
        role: user.role.name as Role,
      });
      const accessToken = await jwtSign({
        type: 'access',
        username: user.username,
        role: user.role.name as Role,
      });
      if (refreshToken === false && accessToken === false) throw new Error('Error generating tokens');
      const tokens = {
        accessToken,
        refreshToken,
      };
      const setTokenResponse = await redisSetRefreshTokenInDB(
        { username: user.username, role: user.role.name as Role, version: tokenVersion },
        refreshToken as string,
      );
      if (!setTokenResponse) throw new Error('error Setting token');
      return {
        error: false,
        data: tokens as JwtTokens,
        user,
      };
    } catch (e) {
      /* istanbul ignore next */
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      }
      /* istanbul ignore next */
      return {
        error: true,
        message: 'Can not login user',
      };
    }
  }

  @FieldResolver(/* istanbul ignore next */ () => User)
  async checkCode(@Arg('data') { phone, code }: CheckCodeResoleverInputs): Promise<NewTokensResponse> {
    /* istanbul ignore next */
    try {
      const user = await User.findOne({ phone }, { relations: ['role'] });
      if (!user) throw new Error('BusinessTypes not exist');

      if (user.confirmationCode !== code) throw new Error('Wrong verification code');

      const tokenVersion = makeRandomString();
      const refreshToken = await jwtSign({
        type: 'refresh',
        username: user.username,
        version: tokenVersion,
        role: user.role.name as Role,
      });
      const accessToken = await jwtSign({
        type: 'access',
        username: user.username,
        role: user.role.name as Role,
      });
      if (refreshToken === false && accessToken === false) throw new Error('Error generating tokens');
      const tokens = {
        accessToken,
        refreshToken,
      };
      const setTokenResponse = await redisSetRefreshTokenInDB(
        { username: user.username, role: user.role.name as Role, version: tokenVersion },
        refreshToken as string,
      );
      if (!setTokenResponse) throw new Error('error Setting token');
      return {
        error: false,
        data: tokens as JwtTokens,
      };
    } catch (e) {
      return {
        error: true,
        message: e.message,
      };
    }
  }
}
