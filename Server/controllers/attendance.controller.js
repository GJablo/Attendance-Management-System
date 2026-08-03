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

// Roles that are expected to check in daily and should be auto-marked
// absent if they have no attendance record and no approved leave.
// Adjust this list if "student" should also be tracked.
const TRACKED_STAFF_ROLES = ["employee", "teacher", "hr"];

// How many days back the reconciler will look when filling in missing
// "absent" records. Bounds the work per run and avoids rewriting ancient
// history if the server was offline for a long time.
const RECONCILE_WINDOW_DAYS = 31;

const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const dayKey = (value) => startOfDay(value).getTime();

// Auto-marks tracked staff "absent" for every COMPLETED day (up to and
// including yesterday) on which they neither logged attendance nor were on
// approved leave. Today is intentionally excluded — people can still check in
// until the day is over. Returns the number of records created.
//
// Safe to call repeatedly / concurrently: it skips days that already have a
// record, and the (user, date) unique index rejects any duplicate that slips
// through a race, which we swallow.
export const reconcileAbsentDays = async (referenceDate = new Date()) => {
  // Window: [windowStart 00:00, yesterday 23:59:59.999]. Nothing to do before
  // the first tracked day.
  const yesterdayEnd = endOfDay(addDays(startOfDay(referenceDate), -1));
  const windowStart = startOfDay(
    addDays(startOfDay(referenceDate), -RECONCILE_WINDOW_DAYS),
  );

  if (windowStart > yesterdayEnd) {
    return 0;
  }

  const [staffUsers, records, approvedLeaves] = await Promise.all([
    User.find({ role: { $in: TRACKED_STAFF_ROLES } }).select("_id createdAt"),
    Attendance.find({
      date: { $gte: windowStart, $lte: yesterdayEnd },
    }).select("user date"),
    Leave.find({
      status: "Approved",
      startDate: { $lte: yesterdayEnd },
      endDate: { $gte: windowStart },
    }).select("user startDate endDate"),
  ]);

  if (staffUsers.length === 0) {
    return 0;
  }

  // Fast lookup of "user X already has a record on day D".
  const markedByUser = new Map();
  for (const record of records) {
    const userId = record.user.toString();
    if (!markedByUser.has(userId)) {
      markedByUser.set(userId, new Set());
    }
    markedByUser.get(userId).add(dayKey(record.date));
  }

  const toCreate = [];

  for (const user of staffUsers) {
    const userId = user._id.toString();
    const marked = markedByUser.get(userId) || new Set();

    // Approved-leave day spans for this specific user, so we can skip them.
    const userLeaveSpans = approvedLeaves
      .filter((leave) => leave.user.toString() === userId)
      .map((leave) => ({
        start: startOfDay(leave.startDate).getTime(),
        end: endOfDay(leave.endDate).getTime(),
      }));

    // Don't manufacture absences before the account existed.
    const joinedAt = user.createdAt ? startOfDay(user.createdAt) : windowStart;
    let cursor = joinedAt > windowStart ? joinedAt : windowStart;

    for (; cursor <= yesterdayEnd; cursor = addDays(cursor, 1)) {
      const key = dayKey(cursor);

      if (marked.has(key)) {
        continue;
      }

      const onLeave = userLeaveSpans.some(
        (span) => key >= span.start && key <= span.end,
      );
      if (onLeave) {
        continue;
      }

      toCreate.push({
        user: user._id,
        markedBy: user._id,
        date: startOfDay(cursor),
        status: "absent",
        remarks: "Auto-marked absent",
      });
    }
  }

  if (toCreate.length === 0) {
    return 0;
  }

  try {
    // ordered:false so one duplicate (lost race) doesn't abort the batch.
    const inserted = await Attendance.insertMany(toCreate, { ordered: false });
    return inserted.length;
  } catch (error) {
    // 11000 = duplicate key from the (user,date) index — expected under
    // concurrent reconciles; the row already exists, so it's not a failure.
    if (error?.code === 11000 || error?.writeErrors) {
      return error.result?.insertedCount ?? 0;
    }
    throw error;
  }
};

export const markAttendance = async (req, res, next) => {
  try {
    const now = new Date();
    const dayStart = startOfDay(now);
    const dayEnd = endOfDay(now);

    // Prevent marking attendance more than once per day for the same user
    const existingAttendance = await Attendance.findOne({
      user: req.user._id,
      date: { $gte: dayStart, $lte: dayEnd },
    });

    if (existingAttendance) {
      return res.status(409).json({
        message: "Attendance already marked for today",
        data: existingAttendance,
      });
    }

    // Block self check-in while on approved leave covering today. A leave
    // "covers" today when it started on/before end-of-day and ends on/after
    // start-of-day, which handles single- and multi-day ranges alike.
    const approvedLeaveToday = await Leave.findOne({
      user: req.user._id,
      status: "Approved",
      startDate: { $lte: dayEnd },
      endDate: { $gte: dayStart },
    });

    if (approvedLeaveToday) {
      return res.status(409).json({
        message: "You are on approved leave today and cannot mark attendance",
        data: approvedLeaveToday,
      });
    }

    const attendance = await Attendance.create({
      ...req.body,
      user: req.user._id,
      markedBy: req.user._id,
      date: dayStart,
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
    // Backfill any missing "absent" records for completed days before
    // returning today's snapshot, so the admin view is always up to date.
    await reconcileAbsentDays(new Date());

    const now = new Date();
    const attendances = await Attendance.find({
      date: { $gte: startOfDay(now), $lte: endOfDay(now) },
    }).populate("user", "firstname lastname email role");

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
