import dotEnv from 'dotenv';

dotEnv.config();

// Enviroment
export const CONFIG_ENVIROMENT = process.env.ENVIROMENT || 'development';

// Server port
export const CONFIG_SERVER_PORT = process.env.PORT || 3500;

// DB conection
export const CONFIG_DATABASE_PROVIDER = process.env.DATABASE_PROVIDER || 'mysql';
export const CONFIG_DATABASE_HOST = process.env.DATABASE_HOST || '127.0.0.1:3306';
export const CONFIG_DATABASE_PORT = (process.env.DATABASE_PORT && parseInt(process.env.DATABASE_PORT, 10)) || 3306;
export const CONFIG_DATABASE_USER = process.env.DATABASE_USER || 'Admin';
export const CONFIG_DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'Admin1234!';
export const CONFIG_DATABASE_NAME = process.env.DATABASE_NAME || 'moon_shot';
export const CONFIG_DATABASE_URL = process.env.DATABASE_URL || 'mysql://Admin:Admin1234!@127.0.0.1:3306:3306/moon_shot';

// JWT Tokens
export const CONFIG_JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS || 'asdasasdqwe13';
export const CONFIG_JWT_SECRET_REFRESH = process.env.CONFIG_JWT_SECRET_REFRESH || 'refresh';

// encription secretWord
export const CONFIG_BCRYPT_SALT_ROUNDS = process.env.CONFIG_BCRYPT_SALT_ROUNDS || 10;
