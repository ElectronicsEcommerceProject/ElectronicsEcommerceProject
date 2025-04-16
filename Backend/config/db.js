import dotenv from 'dotenv';

// Explicitly specify the path to the .env file
dotenv.config({ path: '../.env' });

// console.log(process.env.DB_USER)
// console.log(dotenv.config());
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
export default {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_dev',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306
  },
  test: {
    username: process.env.DB_TEST_USER || 'root',
    password: process.env.DB_TEST_PASSWORD || '',
    database: process.env.DB_TEST_NAME || 'ecommerce_test',
    host: process.env.DB_TEST_HOST || '127.0.0.1',
    dialect: 'mysql',
    port: process.env.DB_TEST_PORT || 3306
  },
  production: {
    username: process.env.DB_PROD_USER,
    password: process.env.DB_PROD_PASSWORD,
    database: process.env.DB_PROD_NAME,
    host: process.env.DB_PROD_HOST,
    dialect: 'mysql',
    port: process.env.DB_PROD_PORT || 3306,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};