import request from "supertest";
import app from "../../server.js"; // Import your Express app
import db from "../../src/models/index.js"; // Mock database models
import bcrypt from "bcrypt";
import { encodeJwtToken } from "../../src/middleware/jwt.middleware.js";
import MESSAGE from "../../src/constants/message.js";

jest.mock("../../src/models/index.js");
jest.mock("bcrypt");
jest.mock("../../src/middleware/jwt.middleware.js");

describe("Auth Controller Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      const mockUser = {
        name: "John Doe",
        email: "john@example.com",
        phone_number: "1234567890",
        password: "hashedpassword",
        role: "user",
      };

      db.User.findOne.mockResolvedValue(null); // No existing user
      db.User.create.mockResolvedValue({ ...mockUser, id: 1 });
      bcrypt.hash.mockResolvedValue("hashedpassword");

      const response = await request(app).post("/api/v1/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        phone_number: "1234567890",
        password: "password123",
        role: "user",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe(MESSAGE.post.succ);
      expect(response.body.user).toHaveProperty("email", "john@example.com");
    });

    it("should return conflict if email already exists", async () => {
      db.User.findOne.mockResolvedValue({ email: "john@example.com" });

      const response = await request(app).post("/api/v1/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        phone_number: "1234567890",
        password: "password123",
        role: "user",
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        MESSAGE.custom("User already exists with this email.")
      );
    });

    it("should return conflict if phone number already exists", async () => {
      // First mock call for email check returns null
      // Second mock call for phone number check returns a user
      db.User.findOne.mockImplementation((query) => {
        if (query.where.email) {
          return Promise.resolve(null);
        }
        if (query.where.phone_number) {
          return Promise.resolve({ phone_number: "1234567890" });
        }
        return Promise.resolve(null);
      });

      const response = await request(app).post("/api/v1/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        phone_number: "1234567890",
        password: "password123",
        role: "user",
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        MESSAGE.custom("User already exists with this phone_number.")
      );
    });
  });

  describe("POST /login", () => {
    it("should log in successfully with valid credentials", async () => {
      const mockUser = {
        email: "john@example.com",
        password: "hashedpassword",
        user_id: 1,
        role: "user",
      };

      db.User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      encodeJwtToken.mockReturnValue("mocked-jwt-token");

      const response = await request(app).post("/api/v1/auth/login").send({
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        MESSAGE.get.custom("Login successful")
      );
      expect(response.body.token).toBe("mocked-jwt-token");
    });

    it("should return 404 if user is not found", async () => {
      db.User.findOne.mockResolvedValue(null);

      const response = await request(app).post("/api/v1/auth/login").send({
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(MESSAGE.none);
    });

    it("should return 401 if password is invalid", async () => {
      const mockUser = {
        email: "john@example.com",
        password: "hashedpassword",
      };

      db.User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app).post("/api/v1/auth/login").send({
        email: "john@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(MESSAGE.custom("Invalid password."));
    });
  });
});
