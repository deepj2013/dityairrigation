import mongoose from "mongoose";

const websiteDocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ["PDF", "DOC", "DOCX", "IMAGE", "OTHER"], default: "OTHER" },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("WebsiteDocument", websiteDocumentSchema);
