import { Router } from "express";
import multer from "multer";
import {
  addColumn,
  addRow,
  downloadFileSheet,
  getFileSheet,
  listFileSheets,
  updateCell,
  uploadExcelFile
} from "../controllers/fileController.js";
import { authorize, protect, requirePermission } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect, authorize("UNIVERSAL_ADMIN", "ADMIN"));
router.post("/upload", requirePermission("canManageFiles", "write"), upload.single("file"), uploadExcelFile);
router.get("/", requirePermission("canManageFiles", "read"), listFileSheets);
router.get("/:id", requirePermission("canManageFiles", "read"), getFileSheet);
router.get("/:id/download", requirePermission("canManageFiles", "read"), downloadFileSheet);
router.patch("/:id/cell", requirePermission("canManageFiles", "write"), updateCell);
router.post("/:id/row", requirePermission("canManageFiles", "write"), addRow);
router.post("/:id/column", requirePermission("canManageFiles", "write"), addColumn);

export default router;
