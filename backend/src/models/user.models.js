import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },

    resetOTP: { type: String },
    resetOTPExpires: { type: Date },
    address: { type: String },
    dateOfBirth: { type: Date },
    lastLogin: { type: Date },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving saves the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check password during modify check karna tha
userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
         _id: this._id,
          role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    { 
        expiresIn: "1h"
     }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { 
        _id: this._id 
    }, process.env.REFRESH_TOKEN_SECRET, {
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

const User = mongoose.model("User", userSchema);
export default User;
