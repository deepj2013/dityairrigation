import { Router } from "express";
import { createForm, exportForms, listForms, updateForm } from "../controllers/formController.js";
import FarmerForm from "../models/FarmerForm.js";
import { authorize, protect, requirePermission } from "../middleware/auth.js";

const router = Router();

const resolvePermissionKeyByFormType = (formType = "") => {
  const normalized = String(formType || "").toUpperCase();
  if (normalized === "DEALER") return "canManageDealers";
  if (normalized === "VENDOR" || normalized === "COMPANY") return "canManageVendors";
  return "canManageFarmers";
};

const hasAccess = (permissionValue, accessType) => {
  if (permissionValue === true) return true;
  if (!permissionValue || typeof permissionValue !== "object") return false;
  const canRead = Boolean(permissionValue.read || permissionValue.write);
  const canWrite = Boolean(permissionValue.write);
  return accessType === "write" ? canWrite : canRead;
};

const requireFormPermission = (accessType) => async (req, res, next) => {
  if (req.user.role === "UNIVERSAL_ADMIN") return next();

  let formType = req.body.formType || req.query.formType || "";
  if (!formType && req.params.id) {
    const form = await FarmerForm.findById(req.params.id).select("formType");
    formType = form?.formType || "";
  }

  const permissionKey = resolvePermissionKeyByFormType(formType);
  if (hasAccess(req.user.permissions?.[permissionKey], accessType)) return next();
  return res.status(403).json({ message: "Permission denied" });
};

router.use(protect, authorize("UNIVERSAL_ADMIN", "ADMIN"));
router.post("/", requireFormPermission("write"), createForm);
router.get("/", requireFormPermission("read"), listForms);
router.patch("/:id", requireFormPermission("write"), updateForm);
router.get("/export", requirePermission("canExportData", "read"), exportForms);

export default router;
