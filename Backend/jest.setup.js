// Import jest from @jest/globals to make it available in ES module environments
import { jest } from "@jest/globals";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Get current directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Ensure we're in test environment
process.env.NODE_ENV = "test";

// Load environment variables from .env.test file
const envPath = join(__dirname, ".env.test");
console.log("Loading environment from:", envPath);
dotenv.config({
  path: envPath,
  override: true,
});

// Debug: Log database connection details
console.log("Test Database Configuration:");
console.log("- DB_HOST:", process.env.DB_HOST);
console.log("- DB_USERNAME:", process.env.DB_USERNAME);
console.log("- DB_PASSWORD:", process.env.DB_PASSWORD ? "[SET]" : "[NOT SET]");
console.log("- DB_DATABASE:", process.env.DB_DATABASE);

// Set up global variables and mocks if needed
global.console = {
  ...console,
  // Uncomment these lines if you want to suppress the logs during testing
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
  // info: jest.fn(),
};

// Add a timeout for async operations
jest.setTimeout(30000);
