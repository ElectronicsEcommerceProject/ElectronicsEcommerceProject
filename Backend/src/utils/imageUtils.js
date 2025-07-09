import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Delete image file from filesystem
 * @param {string} imagePath - Relative path to the image
 */
export const deleteImage = (imagePath) => {
  if (!imagePath || imagePath.startsWith('http')) return;
  
  console.log('🔍 Attempting to delete image:', imagePath);
  
  // Handle different path formats
  let correctedPath = imagePath;
  
  // If path starts with uploads/, add src/
  if (imagePath.startsWith('uploads/')) {
    correctedPath = 'src/' + imagePath;
  }
  // If path starts with src/uploads/, use as is
  else if (imagePath.startsWith('src/uploads/')) {
    correctedPath = imagePath;
  }
  // If path is just filename or relative path, assume it's in src/uploads/product_images/
  else if (!imagePath.includes('/')) {
    correctedPath = 'src/uploads/product_images/' + imagePath;
  }
  // Default: assume it needs src/ prefix
  else {
    correctedPath = 'src/' + imagePath;
  }
  
  const fullPath = path.join(__dirname, '../..', correctedPath);
  
  console.log('🔍 Corrected path:', correctedPath);
  console.log('🔍 Full path to delete:', fullPath);
  
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`🗑 Image deleted: ${fullPath}`);
    } catch (error) {
      console.error(`❌ Failed to delete image: ${fullPath}`, error);
    }
  } else {
    console.log(`⚠️ Image not found: ${fullPath}`);
  }
};

/**
 * Delete multiple images from filesystem
 * @param {string[]} imagePaths - Array of relative paths to images
 */
export const deleteImages = (imagePaths) => {
  if (!Array.isArray(imagePaths)) return;
  
  imagePaths.forEach(imagePath => {
    if (imagePath) deleteImage(imagePath);
  });
};