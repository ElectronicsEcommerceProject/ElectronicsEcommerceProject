import express from "express";

import { validator } from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import {
  loginController,
  registerController,
} from "../../controllers/index.js";

const router = express.Router();

// Route for user registration
router.post(
  "/register",
  validator(validators.auth.register, null),
  registerController
);
router.post("/login", validator(validators.auth.login, null), loginController);
// router.post('/register', register); // for testing purpose only
// router.post('/login', login)

export default router;
