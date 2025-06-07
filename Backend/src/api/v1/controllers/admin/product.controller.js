import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";
import slugify from "slugify";
import { Op } from "sequelize";

const { Product, Category, Brand, User } = db;

// ✅ Create a new product
const createProduct = async (req, res) => {
  try {
    // Get the user from the token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Validate category
    const category = await Category.findByPk(req.body.category_id);
    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Category not found" });
    }

    // Validate brand if provided
    if (req.body.brand_id) {
      const brand = await Brand.findByPk(req.body.brand_id);
      if (!brand) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Brand not found" });
      }
    }

    // Generate slug if not provided
    let slug = req.body.slug;
    if (!slug) {
      slug = slugify(req.body.name, { lower: true });

      // Check if slug already exists
      const existingProduct = await Product.findOne({ where: { slug } });
      if (existingProduct) {
        // Append a random string to make it unique
        slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
      }
    }

    // Create the product
    const product = await Product.create({
      ...req.body,
      slug,
      created_by: user.user_id,
    });

    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: error.message,
    });
  }
};

// ✅ Get all products
const getAllProducts = async (req, res) => {
  try {
    //i want to get all products from product table..
    const products = await Product.findAll({});

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// ✅ Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: Category, attributes: ["category_id", "name"] },
        { model: Brand, attributes: ["brand_id", "name"] },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// ✅ Get products by category ID
const getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Category not found",
      });
    }

    const products = await Product.findAll({
      where: { category_id: categoryId },
      include: [
        { model: Brand, attributes: ["brand_id", "name"] },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// filepath: c:\Users\satyam singh\Desktop\vite-project\ElectronicsEcommerceProject\Backend\src\api\v1\controllers\admin\product.controller.js
const getProductsByCategoryAndBrand = async (req, res) => {
  try {
    const { category_id, brand_id } = req.params;

    // Build the filter dynamically
    const filter = {};
    if (category_id) filter.category_id = category_id;
    if (brand_id) filter.brand_id = brand_id;

    const products = await Product.findAll({
      where: filter,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["category_id", "name"],
        },
        { model: Brand, as: "brand", attributes: ["brand_id", "name"] },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products by category and brand:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// ✅ Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.empty,
      });
    }

    // Get the user from the token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.empty,
      });
    }

    // If category_id is provided, validate it
    if (req.body.category_id) {
      const category = await Category.findByPk(req.body.category_id);
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Category not found",
        });
      }
    }

    // If brand_id is provided, validate it
    if (req.body.brand_id) {
      const brand = await Brand.findByPk(req.body.brand_id);
      if (!brand) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Brand not found",
        });
      }
    }

    // If name is changed and slug is not provided, update the slug
    if (req.body.name && !req.body.slug && req.body.name !== product.name) {
      req.body.slug = slugify(req.body.name, { lower: true });

      // Check if slug already exists
      const existingProduct = await Product.findOne({
        where: {
          slug: req.body.slug,
          product_id: { [Op.ne]: id },
        },
      });

      if (existingProduct) {
        // Append a random string to make it unique
        req.body.slug = `${req.body.slug}-${Math.random()
          .toString(36)
          .substring(2, 7)}`;
      }
    }

    // Update the product
    await product.update({
      ...req.body,
    });

    res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: error.message,
    });
  }
};

// ✅ Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // Delete the product
    await product.destroy();

    res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      error: error.message,
    });
  }
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  getProductsByCategoryAndBrand,
  updateProduct,
  deleteProduct,
};
