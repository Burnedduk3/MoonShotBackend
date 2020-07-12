export interface ITwilioSMSResponseSuccess {
  error: false;
  message: 'message Sent';
}

export interface ITwilioSMSResponseError {
  error: true;
  message: string;
}
