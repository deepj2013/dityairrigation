import FarmerForm from "../models/FarmerForm.js";
import { toExcelBuffer } from "../utils/excel.js";

export const createForm = async (req, res) => {
  const form = await FarmerForm.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(form);
};

export const listForms = async (req, res) => {
  const query = {};
  if (req.query.formType) query.formType = req.query.formType;
  if (req.query.status) query.status = req.query.status;

  const forms = await FarmerForm.find(query).sort({ createdAt: -1 });
  res.json(forms);
};

export const updateForm = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  delete updates.createdBy;
  delete updates._id;

  const form = await FarmerForm.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  });
  if (!form) return res.status(404).json({ message: "Form not found" });

  res.json(form);
};

export const exportForms = async (req, res) => {
  const forms = await FarmerForm.find().lean();
  const excelBuffer = toExcelBuffer(forms, "Forms");

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=forms.xlsx");
  res.send(excelBuffer);
};
