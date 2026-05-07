import XLSX from "xlsx";
import FileSheet from "../models/FileSheet.js";

const normalizePermission = (value) => {
  if (value === true) return { read: true, write: true };
  if (!value || typeof value !== "object") return { read: false, write: false };
  return { read: Boolean(value.read || value.write), write: Boolean(value.write) };
};

const getAccessibleFileFilter = (user) => {
  if (user.role === "UNIVERSAL_ADMIN") return {};

  const filePermission = normalizePermission(user.permissions?.canManageFiles);
  if (!filePermission.read && !filePermission.write) {
    return { _id: null };
  }

  const includeOwnUploads = user.fileAccess?.includeOwnUploads !== false;
  const allowedIds = Array.isArray(user.fileAccess?.allowedFileIds)
    ? user.fileAccess.allowedFileIds.filter(Boolean)
    : [];

  const or = [];
  if (includeOwnUploads) or.push({ uploadedBy: user._id });
  if (allowedIds.length) or.push({ _id: { $in: allowedIds } });
  if (!or.length) return { _id: null };
  return { $or: or };
};

export const uploadExcelFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Excel file is required" });

  const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
  const headers = rows.length ? Object.keys(rows[0]) : [];

  const fileSheet = await FileSheet.create({
    fileName: req.body.fileName || req.file.originalname,
    originalName: req.file.originalname,
    sheetName,
    headers,
    rows,
    uploadedBy: req.user._id
  });

  res.status(201).json(fileSheet);
};

export const listFileSheets = async (req, res) => {
  const files = await FileSheet.find(getAccessibleFileFilter(req.user))
    .select("fileName originalName sheetName headers createdAt updatedAt")
    .sort({ createdAt: -1 });
  res.json(files);
};

export const getFileSheet = async (req, res) => {
  const file = await FileSheet.findOne({
    _id: req.params.id,
    ...getAccessibleFileFilter(req.user)
  });
  if (!file) return res.status(404).json({ message: "File not found" });
  res.json(file);
};

export const updateCell = async (req, res) => {
  const { id } = req.params;
  const { rowIndex, column, value } = req.body;
  const file = await FileSheet.findOne({
    _id: id,
    ...getAccessibleFileFilter(req.user)
  });
  if (!file) return res.status(404).json({ message: "File not found" });

  if (rowIndex < 0 || rowIndex >= file.rows.length) {
    return res.status(400).json({ message: "Invalid rowIndex" });
  }
  file.rows[rowIndex] = { ...(file.rows[rowIndex] || {}), [column]: value };
  file.markModified("rows");
  await file.save();
  res.json({ message: "Cell updated", file });
};

export const addRow = async (req, res) => {
  const { id } = req.params;
  const file = await FileSheet.findOne({
    _id: id,
    ...getAccessibleFileFilter(req.user)
  });
  if (!file) return res.status(404).json({ message: "File not found" });

  const blankRow = Object.fromEntries((file.headers || []).map((header) => [header, ""]));
  file.rows.push(blankRow);
  file.markModified("rows");
  await file.save();
  res.json(file);
};

export const addColumn = async (req, res) => {
  const { id } = req.params;
  const { columnName } = req.body;

  const sanitizedColumnName = String(columnName || "").trim();
  if (!sanitizedColumnName) {
    return res.status(400).json({ message: "columnName is required" });
  }

  const file = await FileSheet.findOne({
    _id: id,
    ...getAccessibleFileFilter(req.user)
  });
  if (!file) return res.status(404).json({ message: "File not found" });

  const alreadyExists = (file.headers || []).includes(sanitizedColumnName);
  if (alreadyExists) {
    return res.status(409).json({ message: "Column already exists" });
  }

  file.headers = [...(file.headers || []), sanitizedColumnName];
  file.rows = (file.rows || []).map((row) => ({
    ...(row || {}),
    [sanitizedColumnName]: ""
  }));
  file.markModified("headers");
  file.markModified("rows");
  await file.save();

  res.json(file);
};

export const downloadFileSheet = async (req, res) => {
  const file = await FileSheet.findOne({
    _id: req.params.id,
    ...getAccessibleFileFilter(req.user)
  });
  if (!file) return res.status(404).json({ message: "File not found" });

  const worksheet = XLSX.utils.json_to_sheet(file.rows || []);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, file.sheetName || "Sheet1");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const fileName = (file.fileName || "updated-file").replace(/\.(xlsx|xls)$/i, "");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=\"${fileName}-updated.xlsx\"`);
  res.send(buffer);
};
