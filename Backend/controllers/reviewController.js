import db from '../models/index.js';
const { Review, User, Product } = db;

// ⭐️ Create a new review (only by customers)
export const createReview = async (req, res) => {
  try {
    const { rating, comment, product_id } = req.body;

    // Get user from token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });


    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = await Review.create({
      rating,
      comment,
      product_id,
      user_id: user.user_id
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('❌ Error creating review:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create review', error: error.message });
  }
};


export const updateReview = async (req, res) => {
    try {
      const { review_id } = req.params;
      const { rating, comment } = req.body;
  
      const user = await User.findOne({ where: { email: req.user.email } });
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admin can edit reviews' });
      }
  
      const review = await Review.findByPk(review_id);
      if (!review) return res.status(404).json({ message: 'Review not found' });
  
      review.rating = rating ?? review.rating;
      review.comment = comment ?? review.comment;
      await review.save();
  
      res.status(200).json({ message: 'Review updated', data: review });
    } catch (err) {
      console.error('❌ Error updating review:', err.message);
      res.status(500).json({ message: 'Failed to update review' });
    }
  };
  