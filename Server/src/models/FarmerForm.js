import mongoose from "mongoose";

const farmerFormSchema = new mongoose.Schema(
  {
    formType: {
      type: String,
      enum: ["FARMER", "DEALER", "CANCELLED", "COMPANY", "VENDOR"],
      default: "FARMER"
    },
    क्रमांक: String,
    पंजीयन_क्रमांक: String,
    नाम: String,
    पिता_का_नाम: String,
    जाति: String,
    ग्राम: String,
    ग्राम_पंचायत: String,
    कुल_रकबा: String,
    लाभ_रकबा: String,
    स्पेसिंग: String,
    मोबाइल_नंबर: String,
    श्रोत: String,
    खसरा_क्रमांक: String,
    लागत: String,
    अनुदान: String,
    कृषक_अंश: String,
    आशय_पत्र: String,
    आशय_दिनांक: String,
    विकास_खंड: String,
    कंपनी: String,
    कृषक_अंश_जमा: String,
    UTR_No: String,
    Date: String,
    AGENT: String,
    SUBMIT_DATE: String,
    swikrati_kramank: String,
    payment_date: String,
    saman: String,
    Horti_Depart_Ne_Bataya: String,
    Company_Account_me_aaye: String,
    Diffrance: String,
    Diffreance_ka_karn: String,
    Note: String,
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "COMPLETED", "INCOMPLETE"],
      default: "ACTIVE"
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("FarmerForm", farmerFormSchema);
