// import { Redis } from 'con/redis';
import { Arg, FieldResolver, Query, Resolver } from 'type-graphql';
import { AuthTypes } from './Auth.types';
import { IRefreshTokenInputs } from './login/Login.inputs';
import { LoginTypes, NewTokensResponse } from './login/Login.types';
import { refreshTokenHandler } from './refreshTokenHandler';
import { RegisterTypes } from './register/Register.types';

@Resolver(() => AuthTypes)
export class AuthResolver {
  @Query(() => AuthTypes)
  auth(): AuthTypes {
    return new AuthTypes();
  }
  @Query(() => NewTokensResponse)
  async refreshToken(@Arg('data') { refreshToken }: IRefreshTokenInputs): Promise<NewTokensResponse> {
    return await refreshTokenHandler({ refreshToken });
  }

  @FieldResolver()
  register(): RegisterTypes {
    return new RegisterTypes();
  }

  @FieldResolver()
  login(): LoginTypes {
    return new LoginTypes();
  }
}
