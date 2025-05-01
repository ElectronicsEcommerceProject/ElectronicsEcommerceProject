import express from "express";

import authRoutes from "./auth/auth.route.js";
import adminRoutes from "./admin/index.js";
import customerRoutes from "./customer/index.js";
import retailerRoutes from "./retailer/index.js";


const app = express();

app.use("/auth", authRoutes);

app.use("/admin", adminRoutes);

app.use("/customer", customerRoutes);

app.use("/retailer", retailerRoutes);


export default app;