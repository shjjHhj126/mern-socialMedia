const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error");

const signup = async (req, res, next) => {
  console.log(req.body);
  const { name, username, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) return next(errorHandler(500, "Already have an account"));
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
        "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?size=626&ext=jpg&ga=GA1.1.1687694167.1711972800&semt=sph",
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
    const userId = req.params.id;

    // Find the user to be deleted
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find posts and comments authored by the user
    const userPosts = await postModel.find({ creator: userId });
    const userComments = await commentModel.find({ author: userId });

    // Remove user's posts from other users' likes and saved arrays
    const postIdsToDelete = userPosts.map((post) => post._id);
    await userModel.updateMany(
      {
        $or: [
          { likes: { $in: postIdsToDelete } },
          { saved: { $in: postIdsToDelete } },
        ],
      },
      {
        $pull: {
          likes: { $in: postIdsToDelete },
          saved: { $in: postIdsToDelete },
        },
      }
    );

    // Remove the user from the 'followers', 'followings' array in other user documents
    await userModel.updateMany(
      { $or: [{ followers: userId }, { followings: userId }] },
      { $pull: { followers: userId, followings: userId } }
    );

    // Remove user from the 'likes', 'comments' array in all posts
    await postModel.updateMany(
      { $or: [{ likes: userId }, { comments: userId }] },
      { $pull: { likes: userId, comments: userId } }
    );

    // Delete comments authored by the user
    await commentModel.deleteMany({ author: userId });

    // Delete posts created by the user
    await postModel.deleteMany({ creator: userId });

    // Delete the user account
    await userModel.findByIdAndDelete(userId);

    //no need to save() back the DB

    // Response
    res.clearCookie("access_token");
    res.status(200).json({ message: "Account successfully deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, logout, deleteAccount };
