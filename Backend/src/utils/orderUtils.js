import { v4 as uuidv4 } from "uuid";
import db from "../models/index.js";

const { Order } = db;

/**
 * Generates a unique order number
 * Format: ORD-YYYYMMDD-XXXX (where XXXX is a random alphanumeric string)
 * @returns {Promise<string>} The generated order number
 */
export const generateOrderNumber = async () => {
  // Get current date in YYYYMMDD format
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  // Generate random part (4 characters)
  const randomPart = uuidv4().substring(0, 4).toUpperCase();

  // Combine to create order number
  const orderNumber = `ORD-${dateStr}-${randomPart}`;

  // Check if this order number already exists (very unlikely but possible)
  const existingOrder = await Order.findOne({
    where: { order_number: orderNumber },
  });

  // If it exists (extremely rare case), generate a new one recursively
  if (existingOrder) {
    return generateOrderNumber();
  }

  return orderNumber;
};

/**
 * Calculates shipping cost based on address and order details
 * @param {Object} address - The shipping address
 * @param {number} subtotal - The order subtotal
 * @returns {number} The calculated shipping cost
 */
export const calculateShippingCost = (address, subtotal) => {
  // Free shipping for orders above 1000
  if (subtotal >= 1000) {
    return 0;
  }

  // Base shipping cost
  let shippingCost = 100;

  // Additional cost for certain regions
  const specialRegions = ["North East", "Jammu & Kashmir", "Ladakh"];
  if (specialRegions.includes(address.state)) {
    shippingCost += 50;
  }

  return shippingCost;
};

/**
 * Calculates tax amount based on subtotal and applicable tax rate
 * @param {number} subtotal - The order subtotal
 * @returns {number} The calculated tax amount
 */
export const calculateTaxAmount = (subtotal) => {
  // Standard GST rate of 18%
  const taxRate = 0.18;
  return parseFloat((subtotal * taxRate).toFixed(2));
};

export default {
  generateOrderNumber,
  calculateShippingCost,
  calculateTaxAmount,
};
