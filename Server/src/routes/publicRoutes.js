import { Router } from "express";
import multer from "multer";
import {
  createNotice,
  deleteGalleryImage,
  deleteSiteContent,
  createSiteContent,
  deleteNotice,
  getPublicContent,
  listGalleryImages,
  listNotices,
  listSiteContentAdmin,
  updateNotice,
  updateSiteContent,
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
  requirePermission("canManageNotices", "write"),
  upload.single("image"),
  createNotice
);
router.get(
  "/notice",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageNotices", "read"),
  listNotices
);
router.patch(
  "/notice/:id",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageNotices", "write"),
  upload.single("image"),
  updateNotice
);
router.delete(
  "/notice/:id",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageNotices", "write"),
  deleteNotice
);
router.post(
  "/gallery",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageGallery", "write"),
  upload.single("image"),
  uploadGalleryImage
);
router.get(
  "/gallery",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageGallery", "read"),
  listGalleryImages
);
router.delete(
  "/gallery/:id",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageGallery", "write"),
  deleteGalleryImage
);
router.post(
  "/content",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageWebsite", "write"),
  upload.single("image"),
  createSiteContent
);
router.get(
  "/content",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageWebsite", "read"),
  listSiteContentAdmin
);
router.patch(
  "/content/:id",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageWebsite", "write"),
  upload.single("image"),
  updateSiteContent
);
router.delete(
  "/content/:id",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageWebsite", "write"),
  deleteSiteContent
);
router.post(
  "/document",
  protect,
  authorize("UNIVERSAL_ADMIN", "ADMIN"),
  requirePermission("canManageWebsite", "write"),
  upload.single("file"),
  uploadWebsiteDocument
);

export default router;
