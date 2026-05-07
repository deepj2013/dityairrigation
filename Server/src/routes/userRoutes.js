import { Router } from "express";
import {
  createUser,
  deleteUser,
  listUsers,
  resetUserPassword,
  updateUser
} from "../controllers/userController.js";
import { authorize, protect, requirePermission } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("UNIVERSAL_ADMIN"));
router.post("/", requirePermission("canManageUsers", "write"), createUser);
router.get("/", requirePermission("canManageUsers", "read"), listUsers);
router.patch("/:id", requirePermission("canManageUsers", "write"), updateUser);
router.patch("/:id/password", requirePermission("canManageUsers", "write"), resetUserPassword);
router.delete("/:id", requirePermission("canManageUsers", "write"), deleteUser);

export default router;
