import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["HOME", "ABOUT", "SERVICE", "TOOL", "CONTACT"],
      required: true
    },
    titleHi: { type: String, required: true },
    titleEn: { type: String, required: true },
    descriptionHi: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    ctaLabelHi: { type: String, default: "" },
    ctaLabelEn: { type: String, default: "" },
    ctaLink: { type: String, default: "" },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("SiteContent", siteContentSchema);
