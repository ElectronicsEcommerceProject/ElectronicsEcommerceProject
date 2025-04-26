import express from "express";


import productRoutes from './product.route.js';
import orderRoutes from './order.route.js';
import profileRoutes from './profile.route.js';     
import reviewRoutes from './review.route.js';     
import wishlistRoutes from './wishlist.route.js';     

const app = express();

app.use("/order", orderRoutes);

app.use("/product", productRoutes);

app.use("/profile", profileRoutes);

app.use("/review", reviewRoutes);

app.use("/wishlist", wishlistRoutes);


export default app;