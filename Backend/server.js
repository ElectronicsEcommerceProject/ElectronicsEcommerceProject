import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import zlib from "zlib";
import { StatusCodes } from "http-status-codes";
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

// ✅ Global compression middleware
app.use(compression({
  level: 6,
  threshold: 1024,
}));

// ✅ CORS with proper headers for compression
app.use(cors({
  exposedHeaders: ['Content-Encoding', 'Content-Length']
}));

// ✅ Parse JSON with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Custom middleware to serve compressed static files
const serveCompressedStatic = (staticPath, options = {}) => {
  return (req, res, next) => {
    const filePath = path.join(staticPath, req.path);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return next();
    }

    // Set content type based on file extension
    if (req.path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (req.path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (req.path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }

    // Set cache headers
    if (options.maxAge) {
      res.setHeader('Cache-Control', `public, max-age=${options.maxAge}`);
    }

    // Set compression headers
    res.setHeader('Vary', 'Accept-Encoding');

    // Read and compress file
    const fileContent = fs.readFileSync(filePath);
    const acceptEncoding = req.headers['accept-encoding'] || '';

    if (acceptEncoding.includes('gzip') && (req.path.endsWith('.js') || req.path.endsWith('.css') || req.path.endsWith('.html'))) {
      zlib.gzip(fileContent, (err, compressed) => {
        if (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Compression error');
        }
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Length', compressed.length);
        res.send(compressed);
      });
    } else {
      res.send(fileContent);
    }
  };
};

// ✅ Serve static files from src/uploads with caching
app.use("/uploads", express.static(path.join(__dirname, "src/uploads"), {
  maxAge: '5d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jpg') || filePath.endsWith('.png') || filePath.endsWith('.jpeg')) {
      res.setHeader('Cache-Control', 'public, max-age=432000');
    }
  }
}));

// ✅ Serve frontend build files (for production)
const frontendDistPath = path.join(__dirname, '../Frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  // Serve compressed assets
  app.use('/assets', serveCompressedStatic(path.join(frontendDistPath, 'assets'), {
    maxAge: 31536000 // 1 year
  }));

  // Serve other static files with compression
  app.use(express.static(frontendDistPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Vary', 'Accept-Encoding');
      }
    }
  }));
}

// ✅ API Routes
app.use("/api/v1", mainRoutes);

// ✅ Health check route
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Maa Laxmi Electronics Ecommerce API",
    status: "OK",
    timestamp: new Date().toISOString(),
    compression: "enabled"
  });
});

// ✅ Handle SPA routing (serve index.html for non-API routes)
app.get('*', (req, res) => {
  // Only serve frontend for non-API routes
  if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    const frontendDistPath = path.join(__dirname, '../Frontend/dist');
    if (fs.existsSync(frontendDistPath)) {
      const indexPath = path.join(frontendDistPath, 'index.html');
      const indexContent = fs.readFileSync(indexPath);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Vary', 'Accept-Encoding');

      // Compress HTML if client supports it
      const acceptEncoding = req.headers['accept-encoding'] || '';
      if (acceptEncoding.includes('gzip')) {
        zlib.gzip(indexContent, (err, compressed) => {
          if (err) {
            return res.send(indexContent);
          }
          res.setHeader('Content-Encoding', 'gzip');
          res.send(compressed);
        });
      } else {
        res.send(indexContent);
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Frontend not built. Run npm run build in Frontend directory.' });
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'API endpoint not found' });
  }
});

// ✅ Sync DB and Start Server
const { sequelize } = db;
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ Database connection established successfully.");
    console.log("✅ Database synced successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log("🗜️  Compression enabled for CSS, JS, and HTML files");
    });
  } catch (err) {
    console.error("❌ Failed to connect to the database:", err.message);
    process.exit(1);
  }
})();

export default app;