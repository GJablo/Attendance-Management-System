import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Marked by user is required"],
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    checkIn: {
      type: String,
      trim: true,
    },
    checkOut: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["present", "absent", "leave", "half-day", "holiday"],
      default: "present",
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
