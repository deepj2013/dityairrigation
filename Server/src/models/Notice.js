import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    titleHi: { type: String, required: true },
    titleEn: { type: String, required: true },
    descriptionHi: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);
