import express from "express";

import adminRoutes from "./admin/adminRoutes.js";

import commonRoutes from "./commonRoutes/commonRoutes.js";

const app = express();

app.use("/user", commonRoutes);
app.use("/admin", adminRoutes);

export default app;
