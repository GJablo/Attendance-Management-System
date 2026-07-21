import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
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
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      enum: ["admin", "employee", "user", "teacher", "hr"],
    },
    joiningDate: {
      type: Date,
      required: [true, "Joining date is required"],
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

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
