// Pure derivation from data already fetched elsewhere — no state of its
// own. Kept as a hook (rather than a plain util) so it reads naturally at
// the call site, and so it's easy to unit test in isolation later.
export const useAttendanceBreakdown = (todayAttendance, leaveRequests, users) => {
  const now = new Date();

  // Compare actual Date objects rather than ISO date-string prefixes.
  // String-slicing (e.g. entry.date.slice(0, 10) === todayKey) breaks near
  // timezone boundaries: a record stored at local midnight can serialize
  // to the *previous* calendar day in UTC.
  const onLeaveToday = leaveRequests.filter((entry) => {
    if (entry.status !== "Approved" || !entry.startDate || !entry.endDate) {
      return false;
    }

    const start = new Date(entry.startDate);
    const end = new Date(entry.endDate);

    return start <= now && end >= now;
  });

  const onLeaveUserIds = new Set(
    onLeaveToday.map((entry) => entry.user?._id || entry.user).filter(Boolean),
  );

  // todayAttendance is already scoped to "today" server-side, so it's used
  // as-is rather than re-filtered by date on the client.
  const presentToday = todayAttendance.filter(
    (entry) => entry.status?.toLowerCase() === "present",
  );

  const absentToday = todayAttendance.filter(
    (entry) => entry.status?.toLowerCase() === "absent",
  );

  const markedUserIds = new Set(
    todayAttendance.map((entry) => entry.user?._id || entry.user).filter(Boolean),
  );

  const unmarkedToday = users.filter(
    (entry) =>
      entry.role !== "admin" &&
      !markedUserIds.has(entry._id) &&
      !onLeaveUserIds.has(entry._id),
  );

  return { presentToday, absentToday, onLeaveToday, unmarkedToday };
};
