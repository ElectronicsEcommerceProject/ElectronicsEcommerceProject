import request from "supertest";
import { createServer } from "../../../../../src/api/v1/utils/test.server.js";
import db from "../../../../../src/models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../src/constants/message.js";
import jwt from "jsonwebtoken";
import { ROLES } from "../../../../../src/constants/roles/roles.js";

const app = createServer();

describe("Product Attributes Controller", () => {
  let testUser, testAttribute, authToken;

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

      // Create a test attribute
      testAttribute = await db.Attribute.create({
        name: "Color",
        data_type: "string",
        is_variant_level: true,
        created_by: testUser.user_id,
      });
    } catch (error) {
      console.error("Setup error:", error);
    }
  });

  afterAll(async () => {
    try {
      // Clean up test data
      await db.Attribute.destroy({ where: {}, force: true });
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

  describe("POST /api/v1/admin/product-Attributes", () => {
    it("should add a new attribute", async () => {
      const newAttribute = {
        name: "Size",
        data_type: "string",
        is_variant_level: true,
      };

      const response = await setAuthHeaders(
        request(app).post("/api/v1/admin/product-Attributes")
      ).send({
        name: newAttribute.name,
        data_type: newAttribute.data_type,
        is_variant_level: newAttribute.is_variant_level,
      });

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty("message", MESSAGE.post.succ);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("name", newAttribute.name);
      expect(response.body.data).toHaveProperty(
        "data_type",
        newAttribute.data_type
      );
      expect(response.body.data).toHaveProperty(
        "is_variant_level",
        newAttribute.is_variant_level
      );
    });

    it("should fail when required fields are missing", async () => {
      const response = await setAuthHeaders(
        request(app).post("/api/v1/admin/product-Attributes")
      ).send({});

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/v1/admin/product-Attributes", () => {
    it("should fetch all attributes", async () => {
      const response = await setAuthHeaders(
        request(app).get("/api/v1/admin/product-Attributes")
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.get.succ);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/admin/product-Attributes/:id", () => {
    it("should fetch an attribute by ID", async () => {
      const response = await setAuthHeaders(
        request(app)
          .get(
            `/api/v1/admin/product-Attributes/${testAttribute.dataValues.product_attribute_id}`
          )
          .send({
            id: testAttribute.dataValues.product_attribute_id,
          })
      );

      // console.log("Fetch response body:", JSON.stringify(response.body)); // Log the response body for debugging

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.get.succ);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("name", testAttribute.name);
      expect(response.body.data).toHaveProperty(
        "data_type",
        testAttribute.data_type
      );
    });

    it("should return 404 if attribute does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000"; // Valid UUID format

      const response = await setAuthHeaders(
        request(app).get(`/api/v1/admin/product-Attributes/${nonExistentId}`)
      ).send({ id: nonExistentId });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.get.fail);
    });
  });

  describe("PUT /api/v1/admin/product-Attributes/:id", () => {
    beforeEach(async () => {
      // Recreate test attribute if it was deleted
      if (
        !(await db.Attribute.findByPk(
          testAttribute.dataValues.product_attribute_id
        ))
      ) {
        testAttribute = await db.Attribute.create({
          name: "Color",
          data_type: "string",
          is_variant_level: true,
          created_by: testUser.user_id,
        });
      }
    });

    it("should update an existing attribute", async () => {
      const updatedAttribute = {
        name: "Updated Color",
        data_type: "enum",
        is_variant_level: false,
        product_attribute_id: testAttribute.dataValues.product_attribute_id,
      };

      const response = await setAuthHeaders(
        request(app).put(
          `/api/v1/admin/product-Attributes/${testAttribute.dataValues.product_attribute_id}`
        )
      ).send({
        name: updatedAttribute.name,
        data_type: updatedAttribute.data_type,
        is_variant_level: updatedAttribute.is_variant_level,
        id: updatedAttribute.product_attribute_id,
      });

      // console.log("Update response body:", JSON.stringify(response.body)); // Log the response body for debugging

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.put.succ);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("name", updatedAttribute.name);
      expect(response.body.data).toHaveProperty(
        "data_type",
        updatedAttribute.data_type
      );
      expect(response.body.data).toHaveProperty(
        "is_variant_level",
        updatedAttribute.is_variant_level
      );
    });

    it("should return 404 if attribute does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000"; // Valid UUID format

      const response = await setAuthHeaders(
        request(app).put(`/api/v1/admin/product-Attributes/${nonExistentId}`)
      ).send({
        id: nonExistentId, // Pass the non-existent ID as attribute_id
      });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.get.fail);
    });
  });

  describe("DELETE /api/v1/admin/product-Attributes/:id", () => {
    beforeEach(async () => {
      // Recreate test attribute if it was deleted
      if (!(await db.Attribute.findByPk(testAttribute.id))) {
        testAttribute = await db.Attribute.create({
          name: "Color",
          data_type: "string",
          is_variant_level: true,
          created_by: testUser.user_id,
        });
      }
    });

    it("should delete an existing attribute", async () => {
      const response = await setAuthHeaders(
        request(app).delete(
          `/api/v1/admin/product-Attributes/${testAttribute.dataValues.product_attribute_id}`
        )
      ).send({ id: testAttribute.dataValues.product_attribute_id }); // Pass the ID in the body of the request

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.delete.succ);
    });

    it("should return 404 if attribute does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000"; // Valid UUID format

      const response = await setAuthHeaders(
        request(app).delete(`/api/v1/admin/product-Attributes/${nonExistentId}`)
      );

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.get.fail);
    });
  });
});
