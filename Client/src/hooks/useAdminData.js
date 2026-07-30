import { useEffect, useState } from "react";
import { fetchAdminDashboard, downloadAttendanceReport } from "../api/reports";
import { fetchUsers, updateUserRole as updateUserRoleRequest } from "../api/users";
import {
  fetchAllLeaves,
  updateLeaveStatus as updateLeaveStatusRequest,
} from "../api/leaves";
import { fetchTodayAttendance } from "../api/attendance";

// Everything the admin dashboard needs: the summary widget, the users
// list, all leave requests, and today's attendance — plus the actions
// that mutate them.
export const useAdminData = ({ isActive, setMessage }) => {
  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const [users, setUsers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [activePanel, setActivePanel] = useState("overview");

  const loadDashboard = async () => {
    setDashboardLoading(true);
    setDashboardError("");

    try {
      const data = await fetchAdminDashboard();
      setDashboard(data.data);
    } catch (error) {
      setDashboard(null);
      setDashboardError(error.message);
    } finally {
      setDashboardLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const [usersData, leavesData, attendanceData] = await Promise.all([
        fetchUsers(),
        fetchAllLeaves(),
        fetchTodayAttendance(),
      ]);

      setUsers(usersData.data || []);
      setLeaveRequests(leavesData.data || []);
      setTodayAttendance(attendanceData.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateUserRole = async (userId, nextRole) => {
    try {
      const data = await updateUserRoleRequest(userId, nextRole);
      setUsers((current) =>
        current.map((entry) => (entry._id === userId ? data.data : entry)),
      );
      setMessage("User role updated successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateLeaveStatus = async (leaveId, nextStatus) => {
    try {
      const data = await updateLeaveStatusRequest(leaveId, nextStatus);
      setLeaveRequests((current) =>
        current.map((entry) => (entry._id === leaveId ? data.data : entry)),
      );
      setMessage(`Leave request ${nextStatus.toLowerCase()} successfully.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const downloadReports = async () => {
    try {
      const blob = await downloadAttendanceReport();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "attendance-report.csv";
      link.click();
      window.URL.revokeObjectURL(url);
      setMessage("Report downloaded successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const reset = () => {
    setDashboard(null);
    setDashboardError("");
    setUsers([]);
    setLeaveRequests([]);
    setTodayAttendance([]);
    setActivePanel("overview");
  };

  useEffect(() => {
    if (isActive) {
      loadDashboard();
      loadAdminData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return {
    dashboard,
    dashboardLoading,
    dashboardError,
    users,
    leaveRequests,
    todayAttendance,
    activePanel,
    setActivePanel,
    updateUserRole,
    updateLeaveStatus,
    downloadReports,
    reset,
  };
};
