import twilio from 'twilio';
import { CONFIG_TWILIO_ACCOUNT_SID, CONFIG_TWILIO_ACCOUNT_TOKEN } from './variables';

let client: twilio.Twilio | null = null;
export const Twilio = () => {
  if (!client) {
    client = twilio(CONFIG_TWILIO_ACCOUNT_SID, CONFIG_TWILIO_ACCOUNT_TOKEN);
  }
  return client;
};
