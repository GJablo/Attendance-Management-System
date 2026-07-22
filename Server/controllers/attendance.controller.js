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

export const getAttendances = async (req, res, next) => {
  try {
    const attendances = await Attendance.find();
    res.status(200).json({ success: true, data: attendances });
  } catch (error) {
    next(error);
  }
};

export const getUserAttendance = async (req, res, next) => {
  try {
    // check if user matches token
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied! Not owner" });
    }
    const userAttendance = await Attendance.find({ user: req.params.id });
    res.status(200).json({ success: true, data: userAttendance });
  } catch (error) {
    next(error);
  }
};
