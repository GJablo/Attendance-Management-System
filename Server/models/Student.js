import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    admissionNumber: {
      type: String,
      required: [true, "Admission number is required"],
      unique: true,
      trim: true,
    },
    class: {
      type: String,
      required: [true, "Class is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    guardian: {
      type: String,
      required: [true, "Guardian name is required"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
  },
  { timestamps: true },
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
