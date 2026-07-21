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
    },
    role: {
      type: String,
      enum: ["admin", "employee", "student", "user"],
      default: "user",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
