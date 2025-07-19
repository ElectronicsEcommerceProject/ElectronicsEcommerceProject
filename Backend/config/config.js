import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: 'mysql'
  },
  tidb: {
    username: process.env.DB_USERNAME_TIDB,
    password: process.env.DB_PASSWORD_TIDB,
    database: process.env.DB_DATABASE_TIDB,
    host: process.env.DB_HOST_TIDB,
    port: parseInt(process.env.DB_PORT_TIDB),
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true // Or false if you want to allow self-signed certs
      }
    }
  },
  production: {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_DATABASE_PROD,
    host: process.env.DB_HOST_PROD,
    port: parseInt(process.env.DB_PORT_PROD),
    dialect: 'mysql'
  }
};