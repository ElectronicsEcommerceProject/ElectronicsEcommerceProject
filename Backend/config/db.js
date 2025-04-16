import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ These two lines recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Now you can safely use __dirname
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debugging: Log environment variables to verify they are loaded
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

export default {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'ecommerce_dev',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
  },
  test: {
    username: process.env.DB_TEST_USER || 'root',
    password: process.env.DB_TEST_PASSWORD || '',
    database: process.env.DB_TEST_NAME || 'ecommerce_test',
    host: process.env.DB_TEST_HOST || '127.0.0.1',
    dialect: 'mysql',
    port: process.env.DB_TEST_PORT || 3306,
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
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};