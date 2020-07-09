import { User } from '@entities/User.entity';
import { IConfirmSentCode, ISendConfirmationNumber } from '@modules/services/Services.inputs';
import { IVerifyCodeResponse, IVerifyPhoneResponse, ServicesTypes } from '@modules/services/Services.types';
import { sendTwilioMessage } from '@services/Twilio';
import { Arg, FieldResolver, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';

@Resolver(() => ServicesTypes)
export class ServicesResolver {
  @Query(() => ServicesTypes)
  services(): ServicesTypes {
    return new ServicesTypes();
  }

  @FieldResolver(() => IVerifyPhoneResponse)
  async verifyPhone(@Arg('data') data: ISendConfirmationNumber): Promise<IVerifyPhoneResponse> {
    try {
      const user = await User.findOne({ username: data.username });
      if (!user) throw new Error('No user Found');
      return await sendTwilioMessage(user);
    } catch (e) {
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      } else {
        return {
          error: true,
          message: 'Message not send',
        };
      }
    }
  }

  @FieldResolver(() => IVerifyCodeResponse)
  async verifyCode(@Arg('data') data: IConfirmSentCode): Promise<IVerifyCodeResponse> {
    try {
      const user = await User.findOne({ username: data.username });
      if (!user) throw new Error('No user Found');

      if (user.confirmationCode !== data.code) throw new Error('Confirmation code different');

      user.confirmed = true;

      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ ...user })
        .where('id = :id', { id: user.id })
        .execute();
      return {
        error: false,
        user,
      };
    } catch (e) {
      if (e instanceof Error) {
        return {
          error: true,
          message: e.message,
        };
      } else {
        return {
          error: true,
          message: 'Message not send',
        };
      }
    }
  }
}
