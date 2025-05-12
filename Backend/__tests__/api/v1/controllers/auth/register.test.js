import request from "supertest";
import { createServer } from "../../../../../src/api/v1/utils/test.server.js"; // Update path as needed
import db from "../../../../../src/models/index.js";
import { StatusCodes } from "http-status-codes";
import { ROLES } from "../../../../../src/constants/roles/roles.js";

// Create a new Express application instance for testing
const app = createServer();

// Test suite for register endpoint
describe("POST /api/v1/auth/register", () => {
  // Run once before all tests
  beforeAll(async () => {
    try {
      // Sync database with force true to create fresh tables for testing
      await db.sequelize.sync({ force: true });
    } catch (error) {
      console.error("Database sync error:", error);
    }
  });

  // Run once after all tests are finished
  afterAll(async () => {
    try {
      // Clean up database and close connection
      await db.sequelize.close();
    } catch (error) {
      console.error("Database close error:", error);
    }
  });

  // Run before each test
  beforeEach(async () => {
    try {
      // Clear users table before each test
      await db.User.destroy({ where: {}, truncate: { cascade: true } });
    } catch (error) {
      console.error("Database clean error:", error);
    }
  });

  // Test case: Successful registration
  it("should register a new user successfully", async () => {
    const newUser = {
      name: "Test User",
      email: "test@example.com",
      phone_number: "1234567890",
      password: "password123",
      role: ROLES.CUSTOMER,
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(newUser)
      .expect(StatusCodes.CREATED);

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("name", newUser.name);
    expect(response.body.user).toHaveProperty("email", newUser.email);
    expect(response.body.user).toHaveProperty(
      "phone_number",
      newUser.phone_number
    );
    expect(response.body.user).toHaveProperty("role", newUser.role);
    expect(response.body.user).not.toHaveProperty("password");

    // Verify user was created in database
    const createdUser = await db.User.findOne({
      where: { email: newUser.email },
    });
    expect(createdUser).not.toBeNull();
    expect(createdUser.name).toBe(newUser.name);
  });

  // Test case: Email validation
  it("should fail when email is invalid", async () => {
    const invalidUser = {
      name: "Test User",
      email: "not-an-email",
      phone_number: "1234567890",
      password: "password123",
      role: ROLES.CUSTOMER,
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(invalidUser)
      .expect(StatusCodes.BAD_REQUEST);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Invalid email format");
  });

  // Test case: Missing required fields
  it("should fail when required fields are missing", async () => {
    const incompleteUser = {
      name: "Test User",
      email: "test@example.com",
      // Missing phone_number
      password: "password123",
      // Missing role
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(incompleteUser)
      .expect(StatusCodes.BAD_REQUEST);

    expect(response.body).toHaveProperty("message");
  });

  // Test case: User already exists
  it("should fail when user with email already exists", async () => {
    const existingUser = {
      name: "Existing User",
      email: "existing@example.com",
      phone_number: "1234567890",
      password: "password123",
      role: ROLES.CUSTOMER,
    };

    // First create a user
    await db.User.create({
      name: existingUser.name,
      email: existingUser.email,
      phone_number: existingUser.phone_number,
      password: "hashedpassword", // In real scenario, this would be hashed
      role: existingUser.role,
    });

    // Then try to register the same user
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(existingUser)
      .expect(StatusCodes.CONFLICT);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain(
      "User already exists with this email"
    );
  });

  // Test case: Phone number already exists
  it("should fail when user with phone number already exists", async () => {
    // First create a user
    await db.User.create({
      name: "Phone User",
      email: "phone@example.com",
      phone_number: "9876543210",
      password: "hashedpassword", // In real scenario, this would be hashed
      role: ROLES.CUSTOMER,
    });

    // Then try to register a new user with the same phone number
    const duplicatePhoneUser = {
      name: "New User",
      email: "new@example.com",
      phone_number: "9876543210", // Same phone number
      password: "password123",
      role: ROLES.CUSTOMER,
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(duplicatePhoneUser)
      .expect(StatusCodes.CONFLICT);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain(
      "User already exists with this phone_number"
    );
  });
});
