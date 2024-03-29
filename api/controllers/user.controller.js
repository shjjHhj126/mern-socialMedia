const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const errorHandler = require("../utils/error");
const bcrypt = require("bcryptjs");

const test = (req, res) => {
  res.status(200).send("api route is working");
};
const updateUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      next(errorHandler(404, "User not found"));
    }
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          city: req.body.city,
          from: req.body.from,
          coverPicture: req.body.coverPicture,
        },
      },
      { new: true }
    );
    res.status(200).json("User updated successfully");
  } catch (err) {
    next(err);
  }
};
const getUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      next(errorHandler(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
const updateSaved = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const user = await userModel.findById(req.user.id);
    if (!user) {
      next(errorHandler(404, "User not found"));
    }
    const post = await postModel.findById(req.params.id);
    if (!post) {
      next(errorHandler(404, "Post not found"));
    }

    if (req.body.save && post.likes.includes(req.params.id)) {
      return next(errorHandler(400, "Bad request"));
    }

    const updatedSaved = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          saved: req.save
            ? [...user.saved, req.user.id]
            : user.saved.filter((id) => id.toString() !== req.params.id),
        },
      },
      { new: true }
    );
    res.status(200).json("bookmark updated successfully");
  } catch (err) {
    next(err);
  }
};
const unfollow = async (req, res, next) => {
  try {
    const following = await userModel.findById(req.params.id);
    const follower = await userModel.findById(req.user.id);
    if (!following) {
      return next(errorHandler(404, "following user not found"));
    }
    if (!follower) {
      return next(errorHandler(404, "follower user not found"));
    }

    if (following.followers.includes(req.user.id)) {
      following.followers = following.followers.filter(
        (id) => id.toString() !== req.user.id
      );
    }
    if (follower.followings.includes(req.params.id)) {
      follower.followings = follower.followings.filter(
        (id) => id.toString() !== req.params.id
      );
    }
    await follower.save();
    await following.save();
    res.status(200).json("Successfully unfollowed");
  } catch (err) {
    next(err);
  }
};
const follow = async (req, res, next) => {
  try {
    const following = await userModel.findById(req.params.id);
    const follower = await userModel.findById(req.user.id);
    if (!following) {
      return next(errorHandler(404, "following user not found"));
    }
    if (!follower) {
      return next(errorHandler(404, "follower user not found"));
    }

    if (!following.followers.includes(req.user.id)) {
      following.followers = [...following.followers, req.user.id];
    }
    if (!follower.followings.includes(req.params.id)) {
      follower.followings = [...follower.followings, req.params.id];
    }
    await follower.save();
    await following.save();
    res.status(200).json("Successfully followed");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  test,
  updateUser,
  getUser,
  follow,
  unfollow,
  updateSaved,
};
