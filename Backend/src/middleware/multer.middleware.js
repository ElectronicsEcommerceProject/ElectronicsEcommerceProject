import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { StatusCodes } from "http-status-codes";
import sharp from "sharp";

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create directories if they don't exist
const projectRoot = path.join(__dirname, "../");
const profileImagesDir = path.join(projectRoot, "uploads/profile_images");
const productImagesDir = path.join(projectRoot, "uploads/product_images");

// Create directories if they don't exist
if (!fs.existsSync(profileImagesDir)) {
  fs.mkdirSync(profileImagesDir, { recursive: true });
}

if (!fs.existsSync(productImagesDir)) {
  fs.mkdirSync(productImagesDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Choose destination based on the route
    let uploadPath;
    if (req.originalUrl.includes("product")) {
      uploadPath = productImagesDir;
    } else {
      uploadPath = profileImagesDir;
    }



    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(
      file.originalname
    )}`;



    cb(null, filename);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png) are allowed!"));
  }
};

// Initialize multer with higher file size limit for compression
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit (before compression)
  fileFilter,
});

// Image compression function
const compressImage = async (filePath, maxSizeBytes = 400 * 1024) => {
  try {
    // Wait a bit for file to be fully written
    await new Promise((resolve) => setTimeout(resolve, 100));

    const stats = fs.statSync(filePath);

    // If file is already under 400KB, no compression needed
    if (stats.size <= maxSizeBytes) {
      return;
    }

    // Start with quality 70 and reduce if needed
    let quality = 70;
    let compressedBuffer;

    do {
      compressedBuffer = await sharp(filePath)
        .jpeg({ quality, progressive: true })
        .toBuffer();

      if (compressedBuffer.length <= maxSizeBytes) {
        break;
      }

      quality -= 10;
    } while (quality > 10 && compressedBuffer.length > maxSizeBytes);

    // Create temporary file path
    const tempPath = filePath + ".temp";

    // Write compressed image to temp file first
    fs.writeFileSync(tempPath, compressedBuffer);

    // Replace original with compressed
    fs.renameSync(tempPath, filePath);

    const newStats = fs.statSync(filePath);
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

// Export the middleware with console logging for debugging
export default {
  single: (fieldName) => {
    return async (req, res, next) => {
      upload.single(fieldName)(req, res, async (err) => {
        if (err) {
          console.error("Multer error:", err);
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: err.message,
          });
        }

        // Compress image if it exists (for all uploads: product, variant, and profile)
        if (req.file) {
          try {
            await compressImage(req.file.path);
          } catch (compressionError) {
            // Continue without compression if it fails
          }
        }

        next();
      });
    };
  },
  fields: (fields) => {
    return async (req, res, next) => {
      upload.fields(fields)(req, res, async (err) => {
        if (err) {
          console.error("Multer error:", err);
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: err.message,
          });
        }

        // Compress images if they exist (for all uploads: product, variant, and profile)
        if (req.files) {
          for (const fieldName in req.files) {
            for (const file of req.files[fieldName]) {
              try {
                await compressImage(file.path);
              } catch (compressionError) {
                // Continue without compression if it fails
              }
            }
          }
        }

        next();
      });
    };
  },
};
