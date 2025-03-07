import {User} from "../models/user.models.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {validateEmail}  from "../utils/validateEmail.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, phoneNumber } = req.body;

  if(!username.trim()||!name.trim()||!email.trim()||!password.trim()||!phoneNumber.trim()){
    throw new ApiError(400, "All fields are required!");
  }
  // const validateEmail =validateEmail(email);
  // if(!validateEmail){
  //   throw new ApiError(400, "Invalid email!");
  // }

  const existingUsername = await User.findOne({ username });
  if(existingUsername){
    throw new ApiError(400, "Username already exists!");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) throw new ApiError(400, "User with these email already exists!");


  const avatarlocalPath=req.files?.avatar[0]?.path
  if(!avatarlocalPath){
    throw new ApiError(400,"Fetching avatar failed")
  }
  const avatar =await uploadOnCloudinary(avatarlocalPath)
  if(!avatar.url){
    throw new ApiError(400,"Error while uploading on avatar")
  }

  const newUser = new User(
    {
        name,
        email, 
        password,
        phoneNumber,
        avatar:avatar.url,
        username:username.toLowerCase()
    });
  await newUser.save();

  res
  .status(201)
  .json(
    new ApiResponse(201, "User registered successfully!", newUser)
);
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) throw new ApiError(400, "Invalid credentials");

  const token = user.generateAccessToken();
  res.status(200).json(new ApiResponse(200, "Login successful", { token, user }));
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "User logged out successfully"));
});


export{
    registerUser,
    loginUser,
    logoutUser
}