import express from "express";


import productRoutes from './product.route.js';
import orderRoutes from './order.route.js';
import profileRoutes from './profile.route.js';     
import categoryRoutes from './category.route.js';     
import couponRoutes from './coupon.route.js';     
import userRoutes from './user.route.js';     
import stockAlertRoutes from './stockAlert.route.js';     
import reviewRoutes from './review.route.js';     

const app = express();

app.use("/order", orderRoutes);

app.use("/product", productRoutes);

app.use("/profile", profileRoutes);

app.use("/category", categoryRoutes);

app.use("/coupon", couponRoutes);

app.use("/user", userRoutes);

app.use("/stock-alert", stockAlertRoutes);

app.use("/review", reviewRoutes);


export default app;