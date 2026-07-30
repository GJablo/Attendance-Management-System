import { useEffect, useState } from "react";
import {
  fetchUserAttendance,
  markAttendance as markAttendanceRequest,
} from "../api/attendance";
import { fetchMyLeaves, createLeave, cancelLeave } from "../api/leaves";

const defaultLeaveForm = () => ({
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  reason: "Annual",
});

// Everything a non-admin's own dashboard needs: mark attendance, request
// leave, and view personal history for both.
export const useUserDashboardData = ({ isActive, userId, setMessage }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveForm, setLeaveForm] = useState(defaultLeaveForm);
  const [attendanceSubmitting, setAttendanceSubmitting] = useState(false);
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  // Tracks which leave request id is currently being cancelled, so we can
  // disable just that row's button instead of the whole list.
  const [cancellingLeaveId, setCancellingLeaveId] = useState(null);

  const loadData = async () => {
    if (!userId) {
      return;
    }

    try {
      const [attendanceData, leavesData] = await Promise.all([
        fetchUserAttendance(userId),
        fetchMyLeaves(),
      ]);

      setAttendanceRecords(attendanceData.data || []);
      setLeaveHistory(leavesData.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const markAttendance = async (status) => {
    setAttendanceSubmitting(true);

    try {
      await markAttendanceRequest({
        date: new Date().toISOString(),
        status,
        checkIn: "09:00",
        checkOut: "17:00",
        remarks: `Marked ${status} from dashboard`,
      });

      setMessage(
        `${status.charAt(0).toUpperCase() + status.slice(1)} marked successfully.`,
      );
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setAttendanceSubmitting(false);
    }
  };

  const submitLeaveRequest = async (event) => {
    event.preventDefault();
    setLeaveSubmitting(true);

    try {
      await createLeave(leaveForm);
      setLeaveForm(defaultLeaveForm());
      setMessage("Leave request submitted successfully.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLeaveSubmitting(false);
    }
  };

  const cancelLeaveRequest = async (leaveId) => {
    setCancellingLeaveId(leaveId);

    try {
      await cancelLeave(leaveId);
      setMessage("Leave request cancelled.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setCancellingLeaveId(null);
    }
  };

  const reset = () => {
    setAttendanceRecords([]);
    setLeaveHistory([]);
  };

  useEffect(() => {
    if (isActive) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, userId]);

  return {
    attendanceRecords,
    leaveHistory,
    leaveForm,
    setLeaveForm,
    attendanceSubmitting,
    leaveSubmitting,
    markAttendance,
    submitLeaveRequest,
    cancelLeaveRequest,
    cancellingLeaveId,
    reset,
  };
};
