import { Router } from "express";
import multer from "multer";
import {
  createNotice,
  createSiteContent,
  getPublicContent,
  uploadGalleryImage,
  uploadWebsiteDocument
} from "../controllers/publicController.js";
import { authorize, protect, requirePermission } from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`);
  }
});

const upload = multer({ storage });
const router = Router();

router.get("/", getPublicContent);
router.post(
  "/notice",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageNotices"),
  createNotice
);
router.post(
  "/gallery",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageGallery"),
  upload.single("image"),
  uploadGalleryImage
);
router.post(
  "/content",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageWebsite"),
  createSiteContent
);
router.post(
  "/document",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageWebsite"),
  upload.single("file"),
  uploadWebsiteDocument
);

export default router;
