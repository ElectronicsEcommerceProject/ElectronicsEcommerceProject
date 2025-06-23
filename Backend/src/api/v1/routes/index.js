import express from "express";

import adminRoutes from "./admin/adminRoutes.js";

import commonRoutes from "./commonRoutes/commonRoutes.js";
import authRoutes from "./commonRoutes/auth/auth.route.js";

const app = express();

app.use("/auth", authRoutes);
app.use("/user", commonRoutes);
app.use("/admin", adminRoutes);

export default app;
