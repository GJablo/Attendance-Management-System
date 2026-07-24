import Attendance from "../models/Attendance.js";

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getDailyReport = async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const attendances = await Attendance.find({
      date: { $gte: startOfDay(date), $lte: endOfDay(date) },
    }).populate("user", "firstname lastname email role");

    const summary = attendances.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      date: startOfDay(date),
      summary,
      data: attendances,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyReport = async (req, res, next) => {
  try {
    const now = new Date();
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();
    const month = req.query.month ? Number(req.query.month) - 1 : now.getMonth();

    const rangeStart = new Date(year, month, 1, 0, 0, 0, 0);
    const rangeEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const attendances = await Attendance.find({
      date: { $gte: rangeStart, $lte: rangeEnd },
    }).populate("user", "firstname lastname email role");

    const summary = attendances.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      range: { start: rangeStart, end: rangeEnd },
      summary,
      data: attendances,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentReport = async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied! Not owner" });
    }

    const attendances = await Attendance.find({
      user: req.params.id,
    }).sort({ date: -1 });

    const summary = attendances.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      summary,
      data: attendances,
    });
  } catch (error) {
    next(error);
  }
};

const buildReportQuery = ({ from, to, userId }) => {
  const query = {};
  if (userId) query.user = userId;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = startOfDay(from);
    if (to) query.date.$lte = endOfDay(to);
  }
  return query;
};

export const exportReportAsExcel = async (req, res, next) => {
  try {
    const { from, to, userId } = req.query;
    const attendances = await Attendance.find(
      buildReportQuery({ from, to, userId }),
    ).populate("user", "firstname lastname email");

    const header = [
      "Employee",
      "Email",
      "Date",
      "Status",
      "Check In",
      "Check Out",
      "Remarks",
    ];

    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = attendances.map((record) =>
      [
        `${record.user?.firstname ?? ""} ${record.user?.lastname ?? ""}`.trim(),
        record.user?.email ?? "",
        record.date.toISOString().split("T")[0],
        record.status,
        record.checkIn ?? "",
        record.checkOut ?? "",
        record.remarks ?? "",
      ]
        .map(escapeCsv)
        .join(","),
    );

    const csv = [header.map(escapeCsv).join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=attendance-report.csv",
    );
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportReportAsPdf = async (req, res, next) => {
  try {
    const { from, to, userId } = req.query;
    const attendances = await Attendance.find(
      buildReportQuery({ from, to, userId }),
    ).populate("user", "firstname lastname email");

    res.status(501).json({
      success: false,
      message: "PDF export is not yet supported",
      count: attendances.length,
    });
  } catch (error) {
    next(error);
  }
};
