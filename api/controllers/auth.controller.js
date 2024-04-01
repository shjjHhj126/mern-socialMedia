const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error");

const signup = async (req, res, next) => {
  console.log(req.body);
  const { name, username, email, password } = req.body;
  try {
    //encrypt password
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new userModel({
      name,
      username,
      email,
      password: hashedPassword,
      avatar:
        "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg",
      coverPicture:
        "https://firebasestorage.googleapis.com/v0/b/mern-socialmedia-b6969.appspot.com/o/picture-background-en3dnh2zi84sgt3t.jpg?alt=media&token=6636bd66-28df-43ad-b54e-3255536eb2a0",
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

    console.log(rest);
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
//carefully handle all the data, or u may create orphan data!
//haven't try this on postman
const deleteAccount = async (req, res, next) => {
  try {
    // Find the user to be deleted
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove user from the 'likes' array in all posts
    await postModel.updateMany(
      { likes: user._id },
      { $pull: { likes: user._id } }
    );

    // Delete comments authored by the user
    await commentModel.deleteMany({ author: user._id });

    // Remove user's comments from the 'comments' array in all posts
    await postModel.updateMany(
      { comments: user._id },
      { $pull: { comments: user._id } }
    );

    // Remove the user from the 'followers' array in other user documents
    await userModel.updateMany(
      { followers: user._id },
      { $pull: { followers: user._id } }
    );

    // Remove the user from the 'followings' array in other user documents
    await userModel.updateMany(
      { followings: user._id },
      { $pull: { followings: user._id } }
    );

    // Delete the user account
    await userModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Account successfully deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, logout, deleteAccount };
