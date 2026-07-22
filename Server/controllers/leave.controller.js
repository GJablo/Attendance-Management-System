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
