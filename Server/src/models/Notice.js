import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    titleHi: { type: String, trim: true, default: "" },
    titleEn: { type: String, trim: true, default: "" },
    descriptionHi: { type: String, trim: true, default: "" },
    descriptionEn: { type: String, trim: true, default: "" },
    imageUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);
