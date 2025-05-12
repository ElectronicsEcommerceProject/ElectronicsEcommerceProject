import request from "supertest";
import { createServer } from "../../../../../src/api/v1/utils/test.server.js";
import db from "../../../../../src/models/index.js";
import { StatusCodes } from "http-status-codes";
import { ROLES } from "../../../../../src/constants/roles/roles.js";
import bcrypt from "bcrypt";
import { jest } from "@jest/globals";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config({ path: ".env.test" });

// Create a new Express application instance for testing
const app = createServer();

// Test suite for login endpoint
describe("POST /api/v1/auth/login", () => {
  // Test user data
  const testUser = {
    name: "Login Test User",
    email: "logintest@example.com",
    phone_number: "1234567890",
    password: "password123",
    role: ROLES.CUSTOMER,
  };

  // Hashed password for the test user
  let hashedPassword;

  // Run once before all tests
  beforeAll(async () => {
    try {
      // Verify JWT_SECRET is set
      console.log(
        "JWT_SECRET for tests:",
        process.env.JWT_SECRET ? "[SET]" : "[NOT SET]"
      );

      // Hash the password for storage
      hashedPassword = await bcrypt.hash(testUser.password, 10);

      // Instead of force sync, just truncate the User table
      await db.User.destroy({
        where: {},
        truncate: { cascade: true },
        force: true,
      });
    } catch (error) {
      console.error("Database setup error:", error);
    }
  });

  // Run once after all tests are finished
  afterAll(async () => {
    try {
      // Clean up database
      await db.User.destroy({
        where: {},
        truncate: { cascade: true },
        force: true,
      });
    } catch (error) {
      console.error("Database cleanup error:", error);
    }
  });

  // Run before each test
  beforeEach(async () => {
    try {
      // Clear users table before each test
      await db.User.destroy({ where: {} });

      // Create a test user for login tests
      await db.User.create({
        name: testUser.name,
        email: testUser.email,
        phone_number: testUser.phone_number,
        password: hashedPassword, // Store the hashed password
        role: testUser.role,
      });

      // Verify user was created
      const user = await db.User.findOne({ where: { email: testUser.email } });
      if (!user) {
        console.error("Test user was not created successfully");
      } else {
        console.log("Test user created successfully with ID:", user.user_id);
      }
    } catch (error) {
      console.error("Database setup error:", error);
    }
  });

  // Test case: Successful login
  it("should login a user successfully with valid credentials", async () => {
    const loginData = {
      email: testUser.email,
      password: testUser.password,
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginData)
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
    expect(response.body.token.length).toBeGreaterThan(0);
  });

  // Test case: Invalid email
  it("should fail when user with email does not exist", async () => {
    const loginData = {
      email: "nonexistent@example.com",
      password: testUser.password,
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginData)
      .expect(StatusCodes.NOT_FOUND);

    expect(response.body).toHaveProperty("message");
  });

  // Test case: Invalid password
  it("should fail when password is incorrect", async () => {
    const loginData = {
      email: testUser.email,
      password: "wrongpassword",
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginData)
      .expect(StatusCodes.UNAUTHORIZED);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Invalid password");
  });

  // Test case: Email validation
  it("should fail when email format is invalid", async () => {
    const loginData = {
      email: "not-an-email",
      password: testUser.password,
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginData)
      .expect(StatusCodes.BAD_REQUEST);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Invalid email format");
  });

  // Test case: Missing required fields
  it("should fail when required fields are missing", async () => {
    // Missing password
    const missingPasswordResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: testUser.email })
      .expect(StatusCodes.BAD_REQUEST);

    expect(missingPasswordResponse.body).toHaveProperty("message");
    expect(missingPasswordResponse.body.message).toContain(
      "Password is required"
    );

    // Missing email
    const missingEmailResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ password: testUser.password })
      .expect(StatusCodes.BAD_REQUEST);

    expect(missingEmailResponse.body).toHaveProperty("message");
    expect(missingEmailResponse.body.message).toContain("Email is required");
  });

  // Test case: Optional role parameter
  it("should accept an optional role parameter", async () => {
    const loginData = {
      email: testUser.email,
      password: testUser.password,
      role: ROLES.CUSTOMER,
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginData)
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty("token");
  });

  // Test case: Invalid role parameter
  it("should fail when role parameter is invalid", async () => {
    const loginData = {
      email: testUser.email,
      password: testUser.password,
      role: "invalid_role",
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginData)
      .expect(StatusCodes.BAD_REQUEST);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("role");
  });

  // Test case: Server error handling
  it("should handle server errors gracefully", async () => {
    // Create a real database error scenario
    const originalFindOne = db.User.findOne;
    db.User.findOne = jest.fn().mockImplementation(() => {
      throw new Error("Database error");
    });

    const loginData = {
      email: testUser.email,
      password: testUser.password,
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginData)
      .expect(StatusCodes.INTERNAL_SERVER_ERROR);

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("error");

    // Restore the original method
    db.User.findOne = originalFindOne;
  });
});
