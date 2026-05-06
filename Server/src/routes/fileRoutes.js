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

router.use(protect, authorize("UNIVERSAL_ADMIN", "ADMIN"), requirePermission("canManageFiles"));
router.post("/upload", upload.single("file"), uploadExcelFile);
router.get("/", listFileSheets);
router.get("/:id", getFileSheet);
router.get("/:id/download", downloadFileSheet);
router.patch("/:id/cell", updateCell);
router.post("/:id/row", addRow);
router.post("/:id/column", addColumn);

export default router;
