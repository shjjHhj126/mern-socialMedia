const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error");

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    //encrypt password
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json("user created successfully!");
  } catch (err) {
    next(err);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //check if the email exists
    const validUser = await userModel.findOne({ email });

    if (!validUser) return next(errorHandler(404, "User not found"));

    // check the password is correct or not
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong password"));

    //create a jwt token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    //set the cookie
    const { password: password_2, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({ status: 200, data: rest });
  } catch (err) {
    next(err);
  }
};
const logout = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (err) {
    next(err);
  }
};
module.exports = { signup, login, logout };
