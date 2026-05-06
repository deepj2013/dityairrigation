import mongoose from "mongoose";

const fileSheetSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    sheetName: { type: String, required: true },
    headers: [{ type: String }],
    rows: [{ type: mongoose.Schema.Types.Mixed }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("FileSheet", fileSheetSchema);
