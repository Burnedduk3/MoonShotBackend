export interface ITwilioSMSResponseSuccess {
  error: false;
}

export interface ITwilioSMSResponseError {
  error: true;
  message: string;
}
