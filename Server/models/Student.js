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
      enum: [
        "Year 1",
        "Year 2",
        "Year 3",
        "Year 4",
        "Year 5",
        "Masters",
        "PhD",
      ],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      enum: [
        "Computer Science",
        "Software Engineering",
        "Information Technology",
        "Cyber Security",
        "Data Science",
      ],
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
