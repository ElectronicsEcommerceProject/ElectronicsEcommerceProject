import express from "express";

import authRoutes from "./commonRoutes/auth/auth.route.js";
import adminRoutes from "./admin/index.js";
import customerRoutes from "./customer/index.js";
import retailerRoutes from "./retailer/index.js";
import profileRoutes from "./commonRoutes/profile/profile.route.js";
import addressesRoutes from "./commonRoutes/addresses/addresses.route.js";

const app = express();

app.use("/auth", authRoutes);

app.use("/user/profile", profileRoutes);

app.use("/user/addresses", addressesRoutes);

app.use("/user/product-catalog", adminRoutes);

app.use("/user/product-variant", adminRoutes);

app.use("/admin", adminRoutes);

app.use("/customer", customerRoutes);

app.use("/retailer", retailerRoutes);

export default app;
