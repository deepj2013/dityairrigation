import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const permissionSchema = new mongoose.Schema(
  {
    canManageUsers: { type: Boolean, default: false },
    canManageFarmers: { type: Boolean, default: true },
    canManageGallery: { type: Boolean, default: false },
    canManageNotices: { type: Boolean, default: false },
    canExportData: { type: Boolean, default: false },
    canManageWebsite: { type: Boolean, default: false },
    canManageFiles: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["UNIVERSAL_ADMIN", "ADMIN", "FARMER"],
      required: true
    },
    isActive: { type: Boolean, default: true },
    permissions: { type: permissionSchema, default: () => ({}) }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
