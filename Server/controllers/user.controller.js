import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Student from "../models/Student.js";

const EMPLOYEE_ROLES = ["employee", "teacher", "hr"];

// Looks up the department from a user's linked Employee/Student profile.
// Returns null for roles (user, admin) that have no such profile.
const findDepartmentForUser = async (user) => {
  if (EMPLOYEE_ROLES.includes(user.role)) {
    const employee = await Employee.findOne({ user: user._id }).select(
      "department",
    );
    return employee?.department ?? null;
  }
  if (user.role === "student") {
    const student = await Student.findOne({ user: user._id }).select(
      "department",
    );
    return student?.department ?? null;
  }
  return null;
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not Found");
      error.statusCode = 404;
      throw error;
    }

    const department = await findDepartmentForUser(user);

    res
      .status(200)
      .json({ success: true, data: { ...user.toObject(), department } });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    next(error);
  }
};
