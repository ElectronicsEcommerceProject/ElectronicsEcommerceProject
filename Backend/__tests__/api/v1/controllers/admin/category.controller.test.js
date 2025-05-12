import request from "supertest";
import { createServer } from "../../../../../src/api/v1/utils/test.server.js";
import db from "../../../../../src/models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../src/constants/message.js";
import jwt from "jsonwebtoken";
import { ROLES } from "../../../../../src/constants/roles/roles.js";

const app = createServer();

describe("Category Controller", () => {
  let testUser, testCategory, authToken;

  beforeAll(async () => {
    try {
      // Sync database to ensure tables exist
      await db.sequelize.sync({ force: true });

      // Create a test user with all required fields
      testUser = await db.User.create({
        name: "Test Admin",
        email: "admin@example.com",
        password: "password123",
        phone_number: "1234567890", // Adding phone_number which might be required
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

      // Create a test category
      testCategory = await db.Category.create({
        name: "Electronics",
        slug: "electronics",
        target_role: "both",
        created_by: testUser.user_id,
      });
    } catch (error) {
      console.error("Setup error:", error);
    }
  });

  afterAll(async () => {
    try {
      // Clean up test data
      await db.Category.destroy({ where: {}, force: true });
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

  describe("POST /api/v1/admin/category", () => {
    it("should add a new category", async () => {
      const newCategory = {
        name: "Mobiles",
        slug: "mobiles",
        target_role: "customer",
      };

      const response = await setAuthHeaders(
        request(app).post("/api/v1/admin/category")
      ).send(newCategory);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty("message", MESSAGE.post.succ);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("name", newCategory.name);
    });

    it("should fail when required fields are missing", async () => {
      const response = await setAuthHeaders(
        request(app).post("/api/v1/admin/category")
      ).send({});

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty("message");
    });

    it("should fail with invalid target_role", async () => {
      const invalidCategory = {
        name: "Invalid Role",
        slug: "invalid-role",
        target_role: "invalid", // Not one of 'customer', 'retailer', or 'both'
      };

      const response = await setAuthHeaders(
        request(app).post("/api/v1/admin/category")
      ).send(invalidCategory);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/v1/admin/category", () => {
    it("should fetch all categories for admin", async () => {
      const response = await setAuthHeaders(
        request(app).get("/api/v1/admin/category")
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.get.succ);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should return 404 if no categories exist", async () => {
      // Delete all categories first
      await db.Category.destroy({ where: {} });

      const response = await setAuthHeaders(
        request(app).get("/api/v1/admin/category")
      );

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.get.empty);
    });
  });

  describe("PUT /api/v1/admin/category/:id", () => {
    beforeEach(async () => {
      // Recreate test category if it was deleted
      if (!(await db.Category.findByPk(testCategory.category_id))) {
        testCategory = await db.Category.create({
          name: "Electronics",
          slug: "electronics",
          target_role: "both",
          created_by: testUser.user_id,
        });
      }
    });

    it("should update an existing category", async () => {
      const updatedCategory = {
        name: "Updated Electronics",
        slug: "updated-electronics",
      };

      const response = await setAuthHeaders(
        request(app).put(`/api/v1/admin/category/${testCategory.category_id}`)
      ).send(updatedCategory);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.put.succ);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("name", updatedCategory.name);
    });

    it("should return 404 if category does not exist", async () => {
      const response = await setAuthHeaders(
        request(app).put("/api/v1/admin/category/nonexistent-id")
      ).send({ name: "Nonexistent" });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.none);
    });
  });

  describe("DELETE /api/v1/admin/category/:id", () => {
    beforeEach(async () => {
      // Recreate test category if it was deleted
      if (!(await db.Category.findByPk(testCategory.category_id))) {
        testCategory = await db.Category.create({
          name: "Electronics",
          slug: "electronics",
          target_role: "both",
          created_by: testUser.user_id,
        });
      }
    });

    it("should delete an existing category", async () => {
      const response = await setAuthHeaders(
        request(app).delete(
          `/api/v1/admin/category/${testCategory.category_id}`
        )
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.delete.succ);
    });

    it("should return 404 if category does not exist", async () => {
      const response = await setAuthHeaders(
        request(app).delete("/api/v1/admin/category/nonexistent-id")
      );

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.none);
    });
  });
});
