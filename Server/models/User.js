import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    lastname: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      type: String,
      required: [true, "User Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      minLength: 8,
      match: [
        /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
        "Password must be at least 8 characters and include at least one special character",
      ],
    },
    role: {
      type: String,
      enum: ["admin", "employee", "student", "user", "teacher", "hr"],
      default: "user",
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
      trim: true,
      match: [
        /^(07\d{8}|01\d{8}|254\d{9})$/,
        "Phone number must be in the format 07xxxxxxxx, 01xxxxxxxx, or 254xxxxxxxxx",
      ],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
