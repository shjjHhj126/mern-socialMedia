const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");

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
module.exports = { signup };
