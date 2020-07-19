import dotEnv from 'dotenv';

dotEnv.config();

// Enviroment
export const CONFIG_ENVIROMENT = process.env.ENVIROMENT || 'development';

// Server port
export const CONFIG_SERVER_PORT = process.env.PORT || 3500;

// Database
export const CONFIG_DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:0cSaK7WUtesnT5nVg@localhost:5432/moonshot';
export const CONFIG_TEST_DATABASE_URL =
  process.env.TESTDATABASE_URL || 'postgres://postgres:0cSaK7WUtesnT5nVg@localhost:5432/moonshot-test';

// JWT Tokens
export const CONFIG_JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS || 'asdasasdqwe13';
export const CONFIG_JWT_SECRET_REFRESH = process.env.CONFIG_JWT_SECRET_REFRESH || 'refresh';

// encription secretWord
export const CONFIG_BCRYPT_SALT_ROUNDS: number = process.env.CONFIG_BCRYPT_SALT_ROUNDS
  ? +process.env.CONFIG_BCRYPT_SALT_ROUNDS
  : 10;

// Redis
export const CONFIG_REDIS_HOST = process.env.REDIS_HOST || 'redis-13073.c10.us-east-1-4.ec2.cloud.redislabs.com';
export const CONFIG_REDIS_REFRESH_TOKEN_PREFIX =
  process.env.CONFIG_REDIS_REFRESH_TOKEN_PREFIX || 'DevelopRefreshPrefix';
export const CONFIG_REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'aWEkwtTXb3TNCfLsnqrvp49yw1n7iG78';
export const CONFIG_REDIS_PORT = (process.env.REDIS_PORT && parseInt(process.env.REDIS_PORT, 10)) || 13073;


// Twilio
export const CONFIG_TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'AC7b218b46000c5a3f092ab62abe598f7a';
export const CONFIG_TWILIO_ACCOUNT_TOKEN = process.env.TWILIO_ACCOUNT_TOKEN || '65963e7203b05b64dcddbfd2a2f0b3c6';
export const TWILIO_SMS_CELLPHONE_NUMBER = process.env.TWILIO_SMS_CELLPHONE_NUMBER || '+12058906313';
