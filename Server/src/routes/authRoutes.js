import { Router } from "express";
import { forgotPassword, login, me } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/me", protect, me);

export default router;
