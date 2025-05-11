import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./src/models/index.js";
import mainRoutes from "./src/api/v1/routes/index.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Create uploads folder if not exists
const uploadsDir = path.join(__dirname, "uploads/profile_images");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Load .env
dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/v1", mainRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Welcome to Maa Laxmi Electronics Ecommerce API");
});

// ✅ Sync DB and Start Server
const { sequelize } = db; // ✅ Access sequelize from db object
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    // await sequelize.sync({ alter: true });
    // await sequelize.sync({ force: true });
    console.log("✅ Database connection established successfully.");
    console.log("✅ Database synced successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to the database:", err.message);
    process.exit(1);
  }
})();
export default app;
