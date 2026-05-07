import Notice from "../models/Notice.js";
import GalleryImage from "../models/GalleryImage.js";
import SiteContent from "../models/SiteContent.js";
import WebsiteDocument from "../models/WebsiteDocument.js";

export const getPublicContent = async (req, res) => {
  const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
  const gallery = await GalleryImage.find().sort({ createdAt: -1 });
  const content = await SiteContent.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  const documents = await WebsiteDocument.find().sort({ createdAt: -1 });

  res.json({
    notices,
    gallery,
    home: content.filter((item) => item.section === "HOME"),
    about: content.filter((item) => item.section === "ABOUT"),
    services: content.filter((item) => item.section === "SERVICE"),
    tools: content.filter((item) => item.section === "TOOL"),
    contact: content.filter((item) => item.section === "CONTACT"),
    documents
  });
};

export const createNotice = async (req, res) => {
  const payload = {
    titleHi: String(req.body.titleHi || "").trim(),
    titleEn: String(req.body.titleEn || "").trim(),
    descriptionHi: String(req.body.descriptionHi || "").trim(),
    descriptionEn: String(req.body.descriptionEn || "").trim(),
    imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    isActive: String(req.body.isActive || "true") !== "false",
    createdBy: req.user._id
  };

  if (!payload.descriptionHi && !payload.descriptionEn) {
    return res.status(400).json({ message: "At least one description is required" });
  }

  const notice = await Notice.create(payload);
  res.status(201).json(notice);
};

export const listNotices = async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.json(notices);
};

export const updateNotice = async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) return res.status(404).json({ message: "Notice not found" });

  const updates = {
    titleHi: req.body.titleHi,
    titleEn: req.body.titleEn,
    descriptionHi: req.body.descriptionHi,
    descriptionEn: req.body.descriptionEn,
    isActive: req.body.isActive
  };

  Object.entries(updates).forEach(([key, value]) => {
    if (typeof value === "undefined") return;
    if (key === "isActive") {
      notice.isActive = value === true || value === "true";
      return;
    }
    notice[key] = String(value || "").trim();
  });

  if (req.file) {
    notice.imageUrl = `/uploads/${req.file.filename}`;
  }

  if (!notice.descriptionHi && !notice.descriptionEn) {
    return res.status(400).json({ message: "At least one description is required" });
  }

  await notice.save();
  res.json(notice);
};

export const deleteNotice = async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) return res.status(404).json({ message: "Notice not found" });

  await notice.deleteOne();
  res.json({ message: "Notice deleted" });
};

export const uploadGalleryImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Image is required" });

  const image = await GalleryImage.create({
    title: req.body.title || "फोटो",
    imageUrl: `/uploads/${req.file.filename}`,
    uploadedBy: req.user._id
  });

  res.status(201).json(image);
};

export const listGalleryImages = async (req, res) => {
  const gallery = await GalleryImage.find().sort({ createdAt: -1 });
  res.json(gallery);
};

export const deleteGalleryImage = async (req, res) => {
  const galleryItem = await GalleryImage.findById(req.params.id);
  if (!galleryItem) return res.status(404).json({ message: "Image not found" });
  await galleryItem.deleteOne();
  res.json({ message: "Image deleted" });
};

export const createSiteContent = async (req, res) => {
  let parsedMeta = {};
  try {
    parsedMeta = typeof req.body.meta === "string" ? JSON.parse(req.body.meta || "{}") : req.body.meta || {};
  } catch {
    parsedMeta = {};
  }
  const payload = {
    ...req.body,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || "",
    meta: parsedMeta,
    createdBy: req.user._id
  };
  const content = await SiteContent.create(payload);
  res.status(201).json(content);
};

export const listSiteContentAdmin = async (req, res) => {
  const content = await SiteContent.find().sort({ section: 1, order: 1, createdAt: -1 });
  res.json(content);
};

export const updateSiteContent = async (req, res) => {
  const content = await SiteContent.findById(req.params.id);
  if (!content) return res.status(404).json({ message: "Content not found" });

  const keys = [
    "section",
    "titleHi",
    "titleEn",
    "descriptionHi",
    "descriptionEn",
    "ctaLabelHi",
    "ctaLabelEn",
    "ctaLink",
    "order",
    "isActive",
    "meta"
  ];

  keys.forEach((key) => {
    if (typeof req.body[key] === "undefined") return;
    if (key === "meta") {
      try {
        content.meta = typeof req.body.meta === "string" ? JSON.parse(req.body.meta || "{}") : req.body.meta || {};
      } catch {
        content.meta = {};
      }
      return;
    }
    content[key] = req.body[key];
  });
  if (req.file) content.imageUrl = `/uploads/${req.file.filename}`;

  await content.save();
  res.json(content);
};

export const deleteSiteContent = async (req, res) => {
  const content = await SiteContent.findById(req.params.id);
  if (!content) return res.status(404).json({ message: "Content not found" });
  await content.deleteOne();
  res.json({ message: "Content deleted" });
};

export const uploadWebsiteDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "File is required" });
  const ext = req.file.originalname.split(".").pop()?.toUpperCase() || "OTHER";
  const allowed = ["PDF", "DOC", "DOCX", "JPG", "JPEG", "PNG", "WEBP"];
  const fileType = allowed.includes(ext) ? (ext === "JPG" || ext === "JPEG" || ext === "PNG" || ext === "WEBP" ? "IMAGE" : ext) : "OTHER";

  const document = await WebsiteDocument.create({
    title: req.body.title || req.file.originalname,
    fileUrl: `/uploads/${req.file.filename}`,
    fileType,
    uploadedBy: req.user._id
  });

  res.status(201).json(document);
};
