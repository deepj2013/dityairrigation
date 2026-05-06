import User from "../models/User.js";

export const createUser = async (req, res) => {
  const { name, mobile, password, role, permissions, isActive } = req.body;
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
    permissions: permissions || {},
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
    permissions: req.body.permissions,
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
