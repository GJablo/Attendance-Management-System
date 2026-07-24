import mongoose from "mongoose";

import connectDB from "../database/mongodb.js";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";

const userSeeds = [
  {
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    password: "Admin@123",
    role: "admin",
    phone: "07123456789",
  },
  {
    firstname: "Jane",
    lastname: "Mwangi",
    email: "jane.mwangi@example.com",
    password: "Jane@123",
    role: "employee",
    phone: "07234567890",
  },
  {
    firstname: "Brian",
    lastname: "Otieno",
    email: "brian.otieno@example.com",
    password: "Brian@123",
    role: "hr",
    phone: "07345678901",
  },
  {
    firstname: "Grace",
    lastname: "Njeri",
    email: "grace.njeri@example.com",
    password: "Grace@123",
    role: "student",
    phone: "07456789012",
  },
  {
    firstname: "Daniel",
    lastname: "Kiptoo",
    email: "daniel.kiptoo@example.com",
    password: "Daniel@123",
    role: "teacher",
    phone: "07567890123",
  },
  {
    firstname: "Lydia",
    lastname: "Akinyi",
    email: "lydia.akinyi@example.com",
    password: "Lydia@123",
    role: "user",
    phone: "07678901234",
  },
];

const employeeSeeds = [
  {
    department: "Computer Science",
    designation: "employee",
    joiningDate: new Date("2023-01-15"),
  },
  {
    department: "Software Engineering",
    designation: "hr",
    joiningDate: new Date("2021-08-01"),
  },
];

const studentSeeds = [
  {
    admissionNumber: "ADM-1001",
    class: "Year 2",
    department: "Information Technology",
    guardian: "Mary Njeri",
  },
];

const attendanceSeeds = [
  {
    date: new Date("2026-07-24"),
    checkIn: "08:00",
    checkOut: "17:00",
    status: "present",
    remarks: "On time",
  },
  {
    date: new Date("2026-07-25"),
    checkIn: "08:30",
    checkOut: "16:00",
    status: "half-day",
    remarks: "Left early",
  },
  {
    date: new Date("2026-07-26"),
    checkIn: null,
    checkOut: null,
    status: "absent",
    remarks: "No attendance logged",
  },
];

const leaveSeeds = [
  {
    startDate: new Date("2026-08-01"),
    endDate: new Date("2026-08-03"),
    reason: "Annual",
    status: "Pending",
  },
  {
    startDate: new Date("2026-08-10"),
    endDate: new Date("2026-08-12"),
    reason: "Sick",
    status: "Approved",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    const createdUsers = [];
    for (const userSeed of userSeeds) {
      const user = await User.findOneAndUpdate(
        { email: userSeed.email },
        { $setOnInsert: userSeed },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      createdUsers.push(user);
    }

    const employeeUser = createdUsers.find(
      (user) => user.email === "jane.mwangi@example.com",
    );
    const hrUser = createdUsers.find(
      (user) => user.email === "brian.otieno@example.com",
    );
    const studentUser = createdUsers.find(
      (user) => user.email === "grace.njeri@example.com",
    );
    const teacherUser = createdUsers.find(
      (user) => user.email === "daniel.kiptoo@example.com",
    );

    if (employeeUser) {
      await Employee.findOneAndUpdate(
        { user: employeeUser._id },
        { $set: { ...employeeSeeds[0], user: employeeUser._id } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    if (hrUser) {
      await Employee.findOneAndUpdate(
        { user: hrUser._id },
        { $set: { ...employeeSeeds[1], user: hrUser._id } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    if (studentUser) {
      await Student.findOneAndUpdate(
        { user: studentUser._id },
        { $set: { ...studentSeeds[0], user: studentUser._id } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    if (teacherUser) {
      await Attendance.findOneAndUpdate(
        { user: teacherUser._id, date: attendanceSeeds[0].date },
        {
          $set: {
            ...attendanceSeeds[0],
            user: teacherUser._id,
            markedBy: createdUsers[0]._id,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    for (const [index, attendanceSeed] of attendanceSeeds.entries()) {
      const user = createdUsers[index % createdUsers.length];
      await Attendance.findOneAndUpdate(
        { user: user._id, date: attendanceSeed.date },
        {
          $set: {
            ...attendanceSeed,
            user: user._id,
            markedBy: createdUsers[0]._id,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    for (const [index, leaveSeed] of leaveSeeds.entries()) {
      const user = createdUsers[(index + 1) % createdUsers.length];
      await Leave.findOneAndUpdate(
        {
          user: user._id,
          startDate: leaveSeed.startDate,
          endDate: leaveSeed.endDate,
        },
        { $set: { ...leaveSeed, user: user._id } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    console.log("Sample data inserted successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
