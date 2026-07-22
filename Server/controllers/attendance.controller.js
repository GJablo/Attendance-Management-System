import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.create({
      ...req.body,
      user: req.user._id,
    });
    res
      .status(201)
      .json({ message: "Attendance marked successfully", data: attendance });
  } catch (error) {
    next(error);
  }
};
