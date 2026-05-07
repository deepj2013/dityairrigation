import jwt from "jsonwebtoken";
import User from "../models/User.js";

const hasAccess = (permissionValue, accessType) => {
  if (permissionValue === true) return true;
  if (!permissionValue || typeof permissionValue !== "object") return false;

  const canRead = Boolean(permissionValue.read || permissionValue.write);
  const canWrite = Boolean(permissionValue.write);
  return accessType === "write" ? canWrite : canRead;
};

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) return res.status(401).json({ message: "Invalid user" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export const requirePermission = (permissionKey, accessType = "read") => (req, res, next) => {
  if (req.user.role === "UNIVERSAL_ADMIN") return next();
  if (hasAccess(req.user.permissions?.[permissionKey], accessType)) return next();
  return res.status(403).json({ message: "Permission denied" });
};
