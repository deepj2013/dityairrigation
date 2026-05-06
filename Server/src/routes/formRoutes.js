import { Router } from "express";
import { createForm, exportForms, listForms, updateForm } from "../controllers/formController.js";
import { authorize, protect, requirePermission } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("UNIVERSAL_ADMIN", "ADMIN"));
router.post("/", requirePermission("canManageFarmers"), createForm);
router.get("/", requirePermission("canManageFarmers"), listForms);
router.patch("/:id", requirePermission("canManageFarmers"), updateForm);
router.get("/export", requirePermission("canExportData"), exportForms);

export default router;
