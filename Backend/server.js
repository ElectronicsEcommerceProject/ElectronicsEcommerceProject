import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
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

// ✅ Enable Brotli and Gzip compression
app.use(compression({
  brotli: {
    enabled: true,
    zlib: {}
  },
  filter: (req, res) => {
    // Don't compress responses with this request header
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression filter function
    return compression.filter(req, res);
  }
}));

app.use(cors());
app.use(express.json());

// ✅ Serve static files from src/uploads with caching
app.use("/uploads", express.static(path.join(__dirname, "src/uploads"), {
  maxAge: '1y', // Cache for 1 year
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jpg') || filePath.endsWith('.png') || filePath.endsWith('.jpeg')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// ✅ Serve frontend build files (for production)
const frontendDistPath = path.join(__dirname, '../Frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  // Cache static assets
  app.use('/assets', express.static(path.join(frontendDistPath, 'assets'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      if (filePath.endsWith('.js.gz')) {
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Type', 'application/javascript');
      }
      if (filePath.endsWith('.js.br')) {
        res.setHeader('Content-Encoding', 'br');
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
  }));
  
  // Serve other static files
  app.use(express.static(frontendDistPath, {
    maxAge: '1d' // Cache HTML for 1 day
  }));
}

// ✅ Routes
app.use("/api/v1", mainRoutes);

// ✅ Health check route
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Maa Laxmi Electronics Ecommerce API",
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

// ✅ Handle SPA routing (serve index.html for non-API routes)
app.get('*', (req, res) => {
  // Only serve frontend for non-API routes
  if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    const frontendDistPath = path.join(__dirname, '../Frontend/dist');
    if (fs.existsSync(frontendDistPath)) {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    } else {
      res.status(404).json({ message: 'Frontend not built. Run npm run build in Frontend directory.' });
    }
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
});

// ✅ Sync DB and Start Server
const { sequelize } = db;
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    // await sequelize.sync({ force: true }); // Use force: true only for development/testing
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
