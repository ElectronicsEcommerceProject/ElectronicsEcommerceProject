import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Debugging: Log environment variables to verify they are loaded
console.log("Environment:", process.env.NODE_ENV);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

const dbConfigFile = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: Number(process.env.DB_PORT),
  },

  production: {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_DATABASE_PROD,
    host: process.env.DB_HOST_PROD,
    dialect: "mysql",
    port: Number(process.env.DB_PORT_PROD),
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
  tidb: {
    username: process.env.DB_USERNAME_TIDB,
    password: process.env.DB_PASSWORD_TIDB,
    database: process.env.DB_DATABASE_TIDB,
    host: process.env.DB_HOST_TIDB,
    dialect: "mysql",
    port: Number(process.env.DB_PORT_TIDB),
    dialectOptions: {
      ssl: {
        require: true,
        // minVersion: "TLSv1.2",
        // rejectUnauthorized: true,
      },
    },
  },
};

export default dbConfigFile;
