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
  const notice = await Notice.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(notice);
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

export const createSiteContent = async (req, res) => {
  const content = await SiteContent.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(content);
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
