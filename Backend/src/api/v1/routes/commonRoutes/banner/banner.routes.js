import express from "express";
import { adminBannerController } from "../../../controllers/index.js";

const router = express.Router();

// Get active banners (public route for frontend)
router.get("/active", adminBannerController.getActiveBanners);

export default router;