import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String,  unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    //avatar: { type: String, required: true },
    phoneNumber: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    lastLogin: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Security & Authentication Enhancements
    isActive: { type: Boolean, default: true }, // Soft delete
    isMFAEnabled: { type: Boolean, default: false }, // Multi-Factor Auth
    failedLoginAttempts: { type: Number, default: 0 },
    accountLockUntil: { type: Date },

    // Social Login
    authProvider: {
      type: String,
      enum: ["email", "google", "facebook", "github"],
      default: "email",
    },
    providerId: { type: String },

    // Login Tracking
    lastLoginIP: { type: String },
    lastLoginDevice: { type: String },

    // Password Reset
    resetOTP: { type: String },
    resetOTPExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Check password validity
userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000);
  this.resetOTP = otp;
  this.resetOTPExpires = Date.now() + 5 * 60 * 1000;
  return otp;
};

// Generate Reset Password Token
userSchema.methods.generateResetPasswordToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.RESET_PASSWORD_SECRET, {
    expiresIn: "15m",
  });
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  return token;
};

export const User = mongoose.model("User", userSchema);
