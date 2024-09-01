import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from '../utils/error.js';

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    // Check if the password is correct
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    // Create a JWT token with the user ID and type
    const token = jwt.sign(
      { id: validUser._id, type: validUser.type }, // Include both id and type in the token
      process.env.JWT_SECRET
    );

    // Exclude the password from the response data
    const { password: pass, ...rest } = validUser._doc;

    // Send the response with the JWT token and user data
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest); // Respond with user details excluding the password
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try { 
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
