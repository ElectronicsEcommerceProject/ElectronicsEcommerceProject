import express from "express";

import authRoutes from "./auth/auth.route.js";
import adminRoutes from "./admin/index.js";
import customerRoutes from "./customer/index.js";
import retailerRoutes from "./retailer/index.js";
import profileRoutes from "./profiles/profile.route.js";


const app = express();

app.use("/auth", authRoutes);

app.use("/users", profileRoutes);


app.use("/admin", adminRoutes);

app.use("/customer", customerRoutes);

app.use("/retailer", retailerRoutes);


export default app;