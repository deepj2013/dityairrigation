import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const permissionSchema = new mongoose.Schema(
  {
    canManageUsers: { type: mongoose.Schema.Types.Mixed, default: false },
    canManageFarmers: { type: mongoose.Schema.Types.Mixed, default: true },
    canManageVendors: { type: mongoose.Schema.Types.Mixed, default: false },
    canManageDealers: { type: mongoose.Schema.Types.Mixed, default: false },
    canManageGallery: { type: mongoose.Schema.Types.Mixed, default: false },
    canManageNotices: { type: mongoose.Schema.Types.Mixed, default: false },
    canExportData: { type: mongoose.Schema.Types.Mixed, default: false },
    canManageWebsite: { type: mongoose.Schema.Types.Mixed, default: false },
    canManageFiles: { type: mongoose.Schema.Types.Mixed, default: false }
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
    permissions: { type: permissionSchema, default: () => ({}) },
    fileAccess: {
      includeOwnUploads: { type: Boolean, default: true },
      allowedFileIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "FileSheet" }]
    }
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
