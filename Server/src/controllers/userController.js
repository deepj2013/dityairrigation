import User from "../models/User.js";

const permissionKeys = [
  "canManageUsers",
  "canManageFarmers",
  "canManageVendors",
  "canManageDealers",
  "canManageGallery",
  "canManageNotices",
  "canExportData",
  "canManageWebsite",
  "canManageFiles"
];

const normalizePermissionValue = (value) => {
  if (value === true || value === false) return value;
  if (!value || typeof value !== "object") return false;
  return {
    visible: Boolean(value.visible),
    read: Boolean(value.read || value.write),
    write: Boolean(value.write)
  };
};

const normalizePermissions = (permissions = {}) =>
  Object.fromEntries(permissionKeys.map((key) => [key, normalizePermissionValue(permissions?.[key])]));

const normalizeFileAccess = (fileAccess = {}) => {
  const ids = Array.isArray(fileAccess.allowedFileIds)
    ? fileAccess.allowedFileIds.map((id) => String(id || "").trim()).filter(Boolean)
    : [];
  return {
    includeOwnUploads: fileAccess.includeOwnUploads !== false,
    allowedFileIds: [...new Set(ids)]
  };
};

export const createUser = async (req, res) => {
  const { name, mobile, password, role, permissions, isActive, fileAccess } = req.body;
  if (!name || !mobile || !password || !role) {
    return res.status(400).json({ message: "name, mobile, password, role are required" });
  }

  const existing = await User.findOne({ mobile });
  if (existing) return res.status(409).json({ message: "Mobile already exists" });

  const created = await User.create({
    name,
    mobile,
    password,
    role,
    permissions: normalizePermissions(permissions || {}),
    fileAccess: normalizeFileAccess(fileAccess || {}),
    isActive: isActive ?? true
  });

  res.status(201).json({
    id: created._id,
    name: created.name,
    mobile: created.mobile,
    role: created.role
  });
};

export const listUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = {
    name: req.body.name,
    mobile: req.body.mobile,
    role: req.body.role,
    permissions: req.body.permissions ? normalizePermissions(req.body.permissions) : undefined,
    fileAccess: req.body.fileAccess ? normalizeFileAccess(req.body.fileAccess) : undefined,
    isActive: req.body.isActive
  };

  if (req.user._id.toString() === id && req.body.isActive === false) {
    return res.status(400).json({ message: "आप अपने account को inactive नहीं कर सकते।" });
  }

  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (req.user._id.toString() === id) {
    return res.status(400).json({ message: "आप अपना account delete नहीं कर सकते।" });
  }

  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted successfully" });
};

export const resetUserPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "newPassword should be at least 6 characters" });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.password = newPassword;
  await user.save();

  res.json({ message: "Password reset successful" });
};
