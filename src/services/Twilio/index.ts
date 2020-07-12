import { Twilio } from '@config/twilio';
import { CONFIG_ENVIROMENT, TWILIO_SMS_CELLPHONE_NUMBER } from '@config/variables';
import { User } from '@entities/User.entity';
import { Request, Response } from 'express';
import { smsConstant } from './smsConstants';
import { ITwilioSMSResponseError, ITwilioSMSResponseSuccess } from './types';

export const sendTwilioMessage = async (user: User): Promise<ITwilioSMSResponseSuccess | ITwilioSMSResponseError> => {
  const confirmNumber =
    CONFIG_ENVIROMENT === 'development' ? 123456 : Math.floor(Math.random() * Math.floor(899999)) + 100000;

  user.confirmationCode = confirmNumber;

  try {
    await User.update({ id: user.id }, user);
    const response = await Twilio().messages.create({
      body: smsConstant.message + confirmNumber,
      from: TWILIO_SMS_CELLPHONE_NUMBER,
      to: user.phone,
    });
    if (response.status === 'failed') throw new Error('Sending Message Failed');

    return {
      error: false,
      message: 'message Sent',
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
        message: 'Failed Twilio Service',
      };
    }
  }
};

export const httpMessageIdHandler = (_req: Request, res: Response) => {
  return res.send('ok');
};
