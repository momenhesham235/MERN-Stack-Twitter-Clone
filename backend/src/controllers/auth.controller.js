import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import STATUS from "../utils/httpStatusText.js";
import { validateRegisterUser , validateLoginUser} from "../utils/validation/userValidation.js";
import bcrypt from "bcryptjs";
import  generateTokenAndSetCookie  from "../utils/generateToken.js";

/**---------------------------------------
 * @desc    Register User - Sign Up
 * @route    /api/v1/auth/register
 * @method   POST
 * @access   Public
 ------------------------------------*/
export const signup = asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;

    // Validate user input
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ status: STATUS.FAIL, message: error.details[0].message });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(409).json({ status: STATUS.FAIL, message: "Username already taken. Please choose another one." });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(409).json({ status: STATUS.FAIL, message: "User already exists. Please login." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ username, fullname, email, password: hashedPassword });

    if (newUser) {
        // Generate token and set cookie
        generateTokenAndSetCookie(newUser._id, res);

        await newUser.save();
        
        res.status(201).json({ 
            status: STATUS.SUCCESS, 
            message: "User registered successfully" , 
            data  : {
               _id: newUser._id,
                username: newUser.username,
				fullname: newUser.fullname,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
            }
         });
    } else {
        res.status(400).json({ status: STATUS.FAIL, message: "Invalid user data" });
    }
    



});


/**---------------------------------------
 * @desc    Login User
 * @route    /api/v1/auth/login
 * @method   POST
 * @access   Public
 ------------------------------------*/
export const login = asyncHandler(async (req, res) => {
   
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ status: STATUS.FAIL, message: error.details[0].message });
    }

const { identifier, password } = req.body; // identifier = username or email

  if (!identifier || !password) {
    return res.status(400).json({ message: "Please provide both fields" });
  }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const query = isEmail ? { email: identifier } : { username: identifier };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    // Generate token and set cookie
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({ 
        status: STATUS.SUCCESS, 
        message: "User logged in successfully",
        data  : {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        } 
     });

   
     
});


/**---------------------------------------
 * @desc    Logout User
 * @route    /api/v1/auth/logout
 * @method   POST
 * @access   Public
 ------------------------------------*/
export const logout = asyncHandler(async (req, res) => {
   
   		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
});


export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
        return res.status(404).json({ status: STATUS.FAIL, message: "User not found" });
    }
    res.status(200).json({ status: STATUS.SUCCESS, data: user });
});