import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "email-validator";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, phoneNumber } = req.body;

  if (
    !username.trim() ||
    !name.trim() ||
    !email.trim() ||
    !password.trim() 
    // !phoneNumber.trim()
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  // Validate email format
  if (!validator.validate(email)) {
    throw new ApiError(400, "Invalid email format!");
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ApiError(400, "Username already exists!");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser)
    throw new ApiError(400, "User with these email already exists!");

  const newUser = new User({
    name,
    email,
    password,
    // phoneNumber,
    //avatar:avatar.url,
    username: username.toLowerCase(),
  });
  await newUser.save();

  res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully!", newUser));
});

// // Login User
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   console.log('hey');
//   const user = await User.findOne({ email });
//   if (!user) throw new ApiError(404, "User not found");

//   const isMatch = await user.isPasswordCorrect(password);
//   if (!isMatch) throw new ApiError(400, "Invalid credentials");

//   const token = user.generateAccessToken();
//   res.status(200).json(new ApiResponse(200, "Login successful", { token, user }));
// });
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) throw new ApiError(400, "Invalid credentials");

  const token = user.generateAccessToken();

  // 🔥 Set the cookie properly
  res.cookie("accessToken", token, {
    httpOnly: true, // Prevents XSS attacks
    secure: true, // Only HTTPS in production
    sameSite: "none", // CSRF protection
  });

  res.status(200).json(new ApiResponse(200, "Login successful", { user }));
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
