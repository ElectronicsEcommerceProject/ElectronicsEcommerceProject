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

// ✅ Create uploads/profile_images folder if not exists
const uploadsDir = path.join(__dirname, "src/uploads/profile_images");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Load .env
dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static files from src/uploads
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

// ✅ Routes
app.use("/api/v1", mainRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Welcome to Maa Laxmi Electronics Ecommerce API");
});

// ✅ Sync DB and Start Server
const { sequelize } = db;
const PORT = 3000;

(async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync();
    await sequelize.sync({ force: true }); // Use force: true only for development/testing
    // await sequelize.sync({ alter: true }); //use alter: true to update the schema without losing data
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
