import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const login = async (req, res) => {
  const { mobile, password } = req.body;
  const user = await User.findOne({ mobile });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    token: signToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      permissions: user.permissions
    }
  });
};

export const me = async (req, res) => {
  res.json(req.user);
};

export const forgotPassword = async (req, res) => {
  const { mobile, newPassword } = req.body;
  if (!mobile || !newPassword) {
    return res.status(400).json({ message: "mobile and newPassword are required" });
  }

  const user = await User.findOne({ mobile });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
};
