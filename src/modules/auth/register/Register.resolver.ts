import { User } from '@entities/User.entity';
import { UserRole } from '@entities/UserRole.entity';
import { Arg, FieldResolver, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { RegisterResolverInputs } from './Register.inputs';
import { RegisterResponse, RegisterTypes } from './Register.types';

@Resolver(() => RegisterTypes)
export class RegisterResolver {
  @FieldResolver(/* istanbul ignore next */ () => User)
  async register(@Arg('data') data: RegisterResolverInputs): Promise<RegisterResponse> {
    try {
      if (data.role !== 'user' && data.role !== 'business') {
        throw new Error('no role provided');
      }
      let findUser = await User.findOne({ where: { username: data.username } });

      if (findUser) {
        throw new Error('username already exist');
      }

      findUser = await User.findOne({ where: { userID: data.userID } });

      if (findUser) {
        throw new Error('User ID already in use');
      }

      findUser = await User.findOne({ where: { email: data.email } });

      if (findUser) {
        throw new Error('email already in user');
      }

      findUser = await User.findOne({ where: { phone: data.phone } });

      if (findUser) {
        throw new Error('phone already in user');
      }

      const user = await User.create({
        userID: data.userID,
        phone: data.phone,
        secondLastname: data.secondLastname,
        password: data.password,
        username: data.username,
        firstLastname: data.firstName,
        email: data.email,
        secondName: data.secondName,
        firstName: data.firstName,
      }).save();
      const roleObj = await UserRole.findOne({ name: data.role });

      await getConnection().createQueryBuilder().relation(User, 'role').of(user).set(roleObj);

      return {
        error: false,
        message: 'User Created',
      };
    } catch (e) {
      return {
        error: true,
        message: e.message,
      };
    }
  }
}
