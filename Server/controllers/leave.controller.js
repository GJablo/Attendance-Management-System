import Leave from "../models/Leave.js";

export const createLeaveRequest = async (req, res, next) => {
  try {
    const leave = await Leave.create({
      ...req.body,
      user: req.user._id,
    });
    res
      .status(201)
      .json({ message: "Leave requested successfully", data: leave });
  } catch (error) {
    next(error);
  }
};

// get employee leaves
export const getLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find();
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    next(error);
  }
};

// update a leave
export const updateLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    res
      .status(200)
      .json({ message: "Leave Updated Successfully", data: leave });
  } catch (error) {
    next(error);
  }
};

// delete a leave request
export const deleteLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Requested leave not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Requested leave deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// cancel a leave by the requested user
export const cancelLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    if (leave.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Access denied! Not owner of Account" });
    }
    if (leave.status === "Cancelled") {
      return res.status(400).json({ message: "Leave already Cancelled" });
    }
    leave.status = "Cancelled";
    await leave.save();
    res.status(200).json({
      message: "Leave Cancelled successfully",
      data: leave,
    });
  } catch (error) {
    next(error);
  }
};
