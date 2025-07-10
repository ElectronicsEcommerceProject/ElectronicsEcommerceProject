import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";
import { deleteImage } from "../../../../utils/imageUtils.js";

const { Banner, User } = db;

// Add a new banner
const addBanner = async (req, res) => {
  try {
    const { title, description, price, discount, bg_class, button_text, is_active, display_order } = req.body;

    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: MESSAGE.none });
    }
    const created_by = user.dataValues.user_id;

    const bannerData = {
      title,
      description,
      price,
      discount,
      bg_class: bg_class || "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700",
      button_text,
      is_active: is_active !== undefined ? is_active : true,
      display_order: display_order || 0,
      created_by,
    };

    if (req.files && req.files.length > 0) {
      const imageFile = req.files.find(file => file.fieldname === 'image');
      if (imageFile) {
        // Save relative path instead of absolute path
        bannerData.image_url = imageFile.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/');
      }
    }

    const newBanner = await Banner.create(bannerData);
    
    // Convert relative path to full URL for response
    if (newBanner.image_url && !newBanner.image_url.startsWith("http")) {
      newBanner.image_url = `${req.protocol}://${req.get("host")}/${newBanner.image_url.replace(/\\/g, "/")}`;
    }
    
    res.status(StatusCodes.CREATED).json({ success: true, message: MESSAGE.post.succ, data: newBanner });
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGE.error, error: error.message });
  }
};

// Get all banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [['display_order', 'ASC'], ['createdAt', 'DESC']],
      include: [
        { model: User, as: 'creator', attributes: ['user_id', 'name', 'email'] },
        { model: User, as: 'updater', attributes: ['user_id', 'name', 'email'] }
      ]
    });

    if (!banners.length) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: MESSAGE.get.empty });
    }

    // Convert relative paths to full URLs for response
    const bannersWithFullUrls = banners.map(banner => {
      if (banner.image_url && !banner.image_url.startsWith("http")) {
        banner.image_url = `${req.protocol}://${req.get("host")}/${banner.image_url.replace(/\\/g, "/")}`;
      }
      return banner;
    });
    
    res.status(StatusCodes.OK).json({ success: true, message: MESSAGE.get.succ, data: bannersWithFullUrls });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGE.error, error: error.message });
  }
};

// Get active banners for frontend
const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC'], ['createdAt', 'DESC']]
    });

    // Convert relative paths to full URLs for response
    const bannersWithFullUrls = banners.map(banner => {
      if (banner.image_url && !banner.image_url.startsWith("http")) {
        banner.image_url = `${req.protocol}://${req.get("host")}/${banner.image_url.replace(/\\/g, "/")}`;
      }
      return banner;
    });
    
    res.status(StatusCodes.OK).json({ success: true, message: MESSAGE.get.succ, data: bannersWithFullUrls });
  } catch (error) {
    console.error("Error fetching active banners:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGE.error, error: error.message });
  }
};

// Update a banner
const updateBannerById = async (req, res) => {
  try {
    const { banner_id } = req.params;
    const { title, description, price, discount, bg_class, button_text, is_active, display_order } = req.body;

    const banner = await Banner.findByPk(banner_id);
    if (!banner) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: MESSAGE.none });
    }

    const user = await User.findOne({ where: { email: req.user.email } });
    if (user) {
      banner.updated_by = user.dataValues.user_id;
    }

    banner.title = title || banner.title;
    banner.description = description || banner.description;
    banner.price = price || banner.price;
    banner.discount = discount || banner.discount;
    banner.bg_class = bg_class || banner.bg_class;
    banner.button_text = button_text || banner.button_text;
    banner.is_active = is_active !== undefined ? is_active : banner.is_active;
    banner.display_order = display_order !== undefined ? display_order : banner.display_order;

    if (req.files && req.files.length > 0) {
      const imageFile = req.files.find(file => file.fieldname === 'image');
      if (imageFile) {
        // Save relative path instead of absolute path
        banner.image_url = imageFile.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/');
      }
    }

    await banner.save();
    
    // Convert relative path to full URL for response
    if (banner.image_url && !banner.image_url.startsWith("http")) {
      banner.image_url = `${req.protocol}://${req.get("host")}/${banner.image_url.replace(/\\/g, "/")}`;
    }

    res.status(StatusCodes.OK).json({ success: true, message: MESSAGE.put.succ, data: banner });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGE.error, error: error.message });
  }
};

// Delete a banner
const deleteBanner = async (req, res) => {
  try {
    const { banner_id } = req.params;

    const banner = await Banner.findByPk(banner_id);
    if (!banner) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: MESSAGE.none });
    }

    // Delete associated image before destroying the banner
    if (banner.image_url) {
      deleteImage(banner.image_url);
    }

    await banner.destroy();

    res.status(StatusCodes.OK).json({ success: true, message: MESSAGE.delete.succ });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGE.error, error: error.message });
  }
};

export default {
  addBanner,
  getAllBanners,
  getActiveBanners,
  updateBannerById,
  deleteBanner,
};