import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      enum: [
        "Annual",
        "Sick",
        "Maternity",
        "Paternity",
        "Compassionate",
        "Study",
        "Emergency",
        "Unpaid",
      ],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
