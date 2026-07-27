import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import User from "../models/User.js";

const startOfDay = (date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
};

const endOfDay = (date) => {
  const day = new Date(date);
  day.setHours(23, 59, 59, 999);
  return day;
};

const ensureDailyAttendanceFallback = async (date = new Date()) => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const [staffUsers, attendanceRecords, approvedLeaves] = await Promise.all([
    User.find({
      role: { $nin: ["student", "user", "hr", "employee", "teacher"] },
    }).select("_id"),
    Attendance.find({ date: { $gte: dayStart, $lte: dayEnd } }),
    Leave.find({
      status: "Approved",
      startDate: { $lte: dayEnd },
      endDate: { $gte: dayStart },
    }).select("user"),
  ]);

  const markedUserIds = new Set(
    attendanceRecords.map((record) => record.user.toString()),
  );
  const leaveUserIds = new Set(
    approvedLeaves.map((entry) => entry.user.toString()),
  );

  const missingUsers = staffUsers.filter(
    (user) =>
      !markedUserIds.has(user._id.toString()) &&
      !leaveUserIds.has(user._id.toString()),
  );

  if (missingUsers.length === 0) {
    return attendanceRecords;
  }

  const existingMissingRecords = await Attendance.find({
    user: { $in: missingUsers.map((user) => user._id) },
    date: { $gte: dayStart, $lte: dayEnd },
  }).select("user");

  const existingMissingUserIds = new Set(
    existingMissingRecords.map((record) => record.user.toString()),
  );

  const recordsToCreate = missingUsers.filter(
    (user) => !existingMissingUserIds.has(user._id.toString()),
  );

  if (recordsToCreate.length > 0) {
    await Attendance.insertMany(
      recordsToCreate.map((user) => ({
        user: user._id,
        markedBy: user._id,
        date: dayStart,
        status: "absent",
        remarks: "Auto-marked absent",
      })),
    );
  }

  const updatedRecords = await Attendance.find({
    date: { $gte: dayStart, $lte: dayEnd },
  });

  return updatedRecords;
};

export const markAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.create({
      ...req.body,
      user: req.user._id,
      markedBy: req.user._id,
    });

    await ensureDailyAttendanceFallback(new Date());

    res
      .status(201)
      .json({ message: "Attendance marked successfully", data: attendance });
  } catch (error) {
    next(error);
  }
};

export const getAttendances = async (req, res, next) => {
  try {
    const attendances = await ensureDailyAttendanceFallback(new Date());
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

export const getAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

// update attendance
export const updateAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(200).json({
      message: "Attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

// delete attendance
export const deleteAttendanceById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    next(error);
  }
};
