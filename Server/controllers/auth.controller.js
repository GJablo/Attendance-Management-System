import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const register = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { firstname, lastname, email, password, role, phone } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("User already exists");
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    // create new user
    const newUsers = await User.create(
      [
        {
          firstname,
          lastname,
          email,
          password: hashedpassword,
          role,
          phone,
        },
      ],
      { session },
    );
    // Generate JWT token
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user: newUsers[0], token },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not Found");
    }

    // check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    // Generate Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res
      .status(200)
      .json({
        success: true,
        message: "User login successful",
        data: { token, user },
      });
  } catch (error) {
    next(error);
  }
};
