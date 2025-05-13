import request from "supertest";
import { createServer } from "../../../../../src/api/v1/utils/test.server.js";
import db from "../../../../../src/models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../src/constants/message.js";
import jwt from "jsonwebtoken";
import { ROLES } from "../../../../../src/constants/roles/roles.js";
import { brand_id } from "../../../../../src/api/v1/validators/brands/brands.validators.js";

const app = createServer();

describe("Brand Controller", () => {
  let testUser, testBrand, authToken;

  beforeAll(async () => {
    try {
      // Sync database to ensure tables exist
      await db.sequelize.sync({ force: true });

      // Create a test user with all required fields
      testUser = await db.User.create({
        name: "Test Admin",
        email: "admin@example.com",
        password: "password123",
        phone_number: "1234567890",
        role: ROLES.ADMIN,
      });

      // Generate a valid JWT token for the test user
      authToken = jwt.sign(
        {
          email: testUser.email,
          role: testUser.role,
          user_id: testUser.user_id,
        },
        process.env.JWT_SECRET || "test-secret",
        { expiresIn: "1h" }
      );

      // Create a test brand
      testBrand = await db.Brand.create({
        name: "Samsung",
        slug: "samsung",
        created_by: testUser.user_id,
      });
    } catch (error) {
      console.error("Setup error:", error);
    }
  });

  afterAll(async () => {
    try {
      // Clean up test data
      await db.Brand.destroy({ where: {}, force: true });
      await db.User.destroy({ where: {}, force: true });
      await db.sequelize.close();
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  });

  // Helper function to set authentication headers for each request
  const setAuthHeaders = (request) => {
    return request.set("Authorization", `Bearer ${authToken}`).set(
      "x-test-user",
      JSON.stringify({
        email: testUser.email,
        role: testUser.role,
        user_id: testUser.user_id,
      })
    );
  };

  describe("POST /api/v1/admin/brands", () => {
    it("should add a new brand", async () => {
      const newBrand = {
        name: "Apple",
        slug: "apple",
      };

      const response = await setAuthHeaders(
        request(app).post("/api/v1/admin/brands")
      ).send(newBrand);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty("message", MESSAGE.post.succ);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("name", newBrand.name);
    });

    it("should fail when required fields are missing", async () => {
      const response = await setAuthHeaders(
        request(app).post("/api/v1/admin/brands")
      ).send({});

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty("message");
    });

    it("should fail with invalid slug format", async () => {
      const invalidBrand = {
        name: "Invalid Slug",
        slug: "Invalid Slug", // Not a valid slug format
      };

      const response = await setAuthHeaders(
        request(app).post("/api/v1/admin/brands")
      ).send(invalidBrand);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/v1/admin/brands", () => {
    it("should fetch all brands", async () => {
      const response = await setAuthHeaders(
        request(app).get("/api/v1/admin/brands")
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.get.succ);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("PUT /api/v1/admin/brands/:id", () => {
    beforeEach(async () => {
      // Recreate test brand if it was deleted
      if (!(await db.Brand.findByPk(testBrand.brand_id))) {
        testBrand = await db.Brand.create({
          name: "Samsung",
          slug: "samsung",
          created_by: testUser.user_id,
        });
      }
    });

    it("should update an existing brand", async () => {
      const updatedBrand = {
        name: "Updated Samsung",
        slug: "updated-samsung",
        brand_id: testBrand.brand_id,
      };

      const response = await setAuthHeaders(
        request(app).put(`/api/v1/admin/brands/${testBrand.brand_id}`)
      ).send(updatedBrand);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.put.succ);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("name", updatedBrand.name);
    });

    it("should return 404 if brand does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000"; // Valid UUID format

      const response = await setAuthHeaders(
        request(app).put(`/api/v1/admin/brands/${nonExistentId}`)
      ).send({
        name: "Nonexistent",
        brand_id: nonExistentId,
      });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.get.none);
    });
  });

  describe("DELETE /api/v1/admin/brands/:id", () => {
    beforeEach(async () => {
      // Recreate test brand if it was deleted
      if (!(await db.Brand.findByPk(testBrand.brand_id))) {
        testBrand = await db.Brand.create({
          name: "Samsung",
          slug: "samsung",
          created_by: testUser.user_id,
        });
      }
    });

    it("should delete an existing brand", async () => {
      const response = await setAuthHeaders(
        request(app).delete(`/api/v1/admin/brands/${testBrand.brand_id}`)
      ).send({ brand_id: testBrand.brand_id });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.delete.succ);
    });

    it("should return 404 if brand does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000"; // Valid UUID format

      const response = await setAuthHeaders(
        request(app).delete(`/api/v1/admin/brands/${nonExistentId}`)
      ).send({ brand_id: nonExistentId });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.get.none);
    });
  });
});
