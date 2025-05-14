import request from "supertest";
import { createServer } from "../../../../../src/api/v1/utils/test.server.js";
import db from "../../../../../src/models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../src/constants/message.js";
import jwt from "jsonwebtoken";
import { ROLES } from "../../../../../src/constants/roles/roles.js";

const app = createServer();

describe("Product Attribute Values Controller", () => {
  let testUser, testAttribute, testAttributeValue, authToken;

  beforeAll(async () => {
    try {
      // Sync database to ensure tables exist
      await db.sequelize.sync({ force: true });

      // Set up associations manually to ensure they work for tests
      db.Attribute.hasMany(db.AttributeValue, {
        foreignKey: "product_attribute_id",
        sourceKey: "product_attribute_id",
      });

      db.AttributeValue.belongsTo(db.Attribute, {
        foreignKey: "product_attribute_id",
        targetKey: "product_attribute_id",
      });

      db.User.hasMany(db.AttributeValue, {
        foreignKey: "created_by",
        as: "createdAttributeValues",
      });

      db.AttributeValue.belongsTo(db.User, {
        foreignKey: "created_by",
        as: "creator",
      });

      db.User.hasMany(db.AttributeValue, {
        foreignKey: "updated_by",
        as: "updatedAttributeValues",
      });

      db.AttributeValue.belongsTo(db.User, {
        foreignKey: "updated_by",
        as: "updater",
      });

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

      // Create a test attribute value
      testAttributeValue = await db.AttributeValue.create({
        product_attribute_id: testAttribute.dataValues.product_attribute_id,
        value: "Red",
        created_by: testUser.user_id,
      });
    } catch (error) {
      console.error("Setup error:", error);
    }
  });

  afterAll(async () => {
    try {
      // Clean up test data
      await db.AttributeValue.destroy({ where: {}, force: true });
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

  describe("POST /api/v1/admin/product-Attributes-Values", () => {
    it("should add a new attribute value", async () => {
      const newAttributeValue = {
        product_attribute_id: testAttribute.dataValues.product_attribute_id,
        value: "Blue",
      };

      const response = await setAuthHeaders(
        request(app).post("/api/v1/admin/product-Attributes-Values")
      ).send(newAttributeValue);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty("message", MESSAGE.post.succ);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty(
        "value",
        newAttributeValue.value
      );
    });

    it("should fail when required fields are missing", async () => {
      const response = await setAuthHeaders(
        request(app).post("/api/v1/admin/product-Attributes-Values")
      ).send({});

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty("message");
    });

    it("should fail when attribute does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000"; // Valid UUID format

      const response = await setAuthHeaders(
        request(app).post("/api/v1/admin/product-Attributes-Values")
      ).send({
        product_attribute_id: nonExistentId,
        value: "Invalid",
      });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.get.empty);
    });
  });

  describe("GET /api/v1/admin/product-Attributes-Values", () => {
    it("should fetch all attribute values", async () => {
      const response = await setAuthHeaders(
        request(app).get("/api/v1/admin/product-Attributes-Values")
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.get.succ);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/admin/product-Attributes-Values/:id", () => {
    it("should fetch an attribute value by ID", async () => {
      const response = await setAuthHeaders(
        request(app).get(
          `/api/v1/admin/product-Attributes-Values/${testAttributeValue.dataValues.attribute_value_id}`
        )
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.get.succ);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty(
        "value",
        testAttributeValue.value
      );
    });

    it("should return 404 if attribute value does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000"; // Valid UUID format

      const response = await setAuthHeaders(
        request(app).get(
          `/api/v1/admin/product-Attributes-Values/${nonExistentId}`
        )
      );

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.get.none);
    });
  });

  describe("GET /api/v1/admin/product-Attributes-Values/attribute/:attributeId", () => {
    it("should fetch attribute values by attribute ID", async () => {
      const response = await setAuthHeaders(
        request(app).get(
          `/api/v1/admin/product-Attributes-Values/attribute/${testAttribute.dataValues.product_attribute_id}`
        )
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.get.succ);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should return 404 if attribute does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000"; // Valid UUID format

      const response = await setAuthHeaders(
        request(app).get(
          `/api/v1/admin/product-Attributes-Values/attribute/${nonExistentId}`
        )
      );

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.get.none);
    });
  });

  describe("PUT /api/v1/admin/product-Attributes-Values/:id", () => {
    it("should update an existing attribute value", async () => {
      const updatedValue = "Green";

      const response = await setAuthHeaders(
        request(app).put(
          `/api/v1/admin/product-Attributes-Values/${testAttributeValue.dataValues.attribute_value_id}`
        )
      ).send({
        value: updatedValue,
      });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.put.succ);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("value", updatedValue);
    });

    it("should return 404 if attribute value does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000"; // Valid UUID format

      const response = await setAuthHeaders(
        request(app).put(
          `/api/v1/admin/product-Attributes-Values/${nonExistentId}`
        )
      ).send({
        value: "NonExistent",
      });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.get.none);
    });
  });

  describe("DELETE /api/v1/admin/product-Attributes-Values/:id", () => {
    it("should delete an existing attribute value", async () => {
      const response = await setAuthHeaders(
        request(app).delete(
          `/api/v1/admin/product-Attributes-Values/${testAttributeValue.dataValues.attribute_value_id}`
        )
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty("message", MESSAGE.delete.succ);
    });

    it("should return 404 if attribute value does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000"; // Valid UUID format

      const response = await setAuthHeaders(
        request(app).delete(
          `/api/v1/admin/product-Attributes-Values/${nonExistentId}`
        )
      );

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty("message", MESSAGE.get.none);
    });
  });
});
