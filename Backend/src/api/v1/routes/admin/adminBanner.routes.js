import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import sharp from "sharp";
import { adminBannerController } from "../../controllers/index.js";
import { validators } from "../../validators/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Banner-specific multer configuration
const bannerImagesDir = path.join(__dirname, "../../../../uploads/banner_images");
if (!fs.existsSync(bannerImagesDir)) {
  fs.mkdirSync(bannerImagesDir, { recursive: true });
}

const bannerUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, bannerImagesDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});

const router = express.Router();

// Add a new banner
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  bannerUpload.any(),
  adminBannerController.addBanner
);

// Get all banners
router.get("/", verifyJwtToken, adminRoleCheck, adminBannerController.getAllBanners);

// Get active banners (public route for frontend)
router.get("/active", adminBannerController.getActiveBanners);

// Update a banner
router.put(
  "/:banner_id",
  verifyJwtToken,
  adminRoleCheck,
  bannerUpload.any(),
  validator(validators.banner.banner_id, "params"),
  adminBannerController.updateBannerById
);

// Delete a banner
router.delete(
  "/:banner_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.banner.banner_id, "params"),
  adminBannerController.deleteBanner
);

export default router;