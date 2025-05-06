import express from "express";

import authRoutes from "./commonRoutes/auth/auth.route.js";
import adminRoutes from "./admin/index.js";
import customerRoutes from "./customer/index.js";
import retailerRoutes from "./retailer/index.js";
import profileAndAddressRoutes from "./commonRoutes/profilesAndAddresses/profileAndAddresses.route.js";

const app = express();

app.use("/auth", authRoutes);

app.use("/users", profileAndAddressRoutes);

app.use("/admin", adminRoutes); //working on it ..

app.use("/customer", customerRoutes);

app.use("/retailer", retailerRoutes);

export default app;
