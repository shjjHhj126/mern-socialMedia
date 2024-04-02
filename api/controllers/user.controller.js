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

    //prevent duplicate email
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await userModel.findOne({ email: req.body.email });
      if (existingUser) {
        return next(errorHandler(400, "Email is already in use"));
      }
    }
    console.log("updateUser() req.body.password", req.body.password);

    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          $set: {
            name: req.body.name || user.name,
            email: req.body.email || user.email,
            password: req.body.password || user.password,
            avatar: req.body.avatar || user.avatar,
            city: req.body.city || user.city,
            from: req.body.from || user.from,
            coverPicture: req.body.coverPicture || user.coverPicture,
            bio: req.body.bio || user.bio,
          },
        },
      },
      { new: true }
    );
    await updatedUser.save();
    res.status(200).json("user updated successfully");
  } catch (err) {
    next(err);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .populate("followers")
      .populate("followings")
      .populate({
        path: "posts",
        populate: {
          path: "comments",
        },
      })
      .populate("likes")
      .populate("saved");
    if (!user) {
      next(errorHandler(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
const getUser = async (req, res, next) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .populate("followers")
      .populate("followings")
      .populate({
        path: "posts",
        populate: {
          path: "comments",
        },
      })
      .populate("likes")
      .populate("saved");
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
    const user = await userModel.findById(req.user.id);
    if (!user) {
      next(errorHandler(404, "User not found"));
    }
    const post = await postModel.findById(req.params.id);
    if (!post) {
      next(errorHandler(404, "Post not found"));
    }

    if (req.body.save && user.saved.includes(req.params.id)) {
      return next(errorHandler(400, "Bad request"));
    }

    const updatedSaved = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        // Use $push to add a new post ID to the saved array or $pull to remove it
        [req.body.save ? "$push" : "$pull"]: { saved: req.params.id },
      },
      { new: true }
    );

    updatedSaved.save();
    res.status(200).json("bookmark updated successfully");
  } catch (err) {
    next(err);
  }
};

const updateFollow = async (req, res, next) => {
  try {
    const following = await userModel.findById(req.params.id);
    if (!following) {
      return next(errorHandler(404, "following user not found"));
    }
    const follower = await userModel.findById(req.user.id);
    if (!follower) {
      return next(errorHandler(404, "follower user not found"));
    }

    //follow
    if (
      req.body.follow &&
      !following.followers.includes(req.user.id) &&
      !follower.followings.includes(req.params.id)
    ) {
      following.followers = [...following.followers, req.user.id];
      follower.followings = [...follower.followings, req.params.id];
    }
    //unfollow
    if (
      !req.body.follow &&
      following.followers.includes(req.user.id) &&
      follower.followings.includes(req.params.id)
    ) {
      following.followers = following.followers.filter(
        (id) => id.toString() !== req.user.id
      );
      follower.followings = follower.followings.filter(
        (id) => id.toString() !== req.params.id
      );
    }
    await follower.save();
    await following.save();
    res.status(200).json(following);
  } catch (err) {
    next(err);
  }
};
const getSavedPosts = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user)
      return next(errorHandler(404, "User not found, can not fetch data"));

    const savedPosts = await postModel
      .find({ _id: { $in: user.saved } }) // Find posts where the creator ID is in the 'following' array
      .populate("creator")
      .populate("comments")
      .sort({ createdAt: "desc" })
      .limit(20);
    console.log(savedPosts);

    res.status(200).json(savedPosts);
  } catch (err) {
    next(err);
  }
};
const removeFollower = async (req, res, next) => {
  try {
    //user.followers remove req.params.id
    const removeFollower = await userModel.findById(req.params.id);
    if (!removeFollower) {
      return next(errorHandler(404, "Follower not found"));
    }
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "Follower not found"));
    }

    if (user.followers.includes(removeFollower._id)) {
      user.followers = user.followers.filter(
        (user_i) => user_i._id.toString() !== removeFollower._id.toString()
      );
    }

    if (removeFollower.followings.includes(user._id)) {
      removeFollower.followings = removeFollower.followings.filter(
        (user_i) => user_i._id.toString() !== user._id.toString()
      );
    }

    await removeFollower.save();
    await user.save();
    res.status(200).json(removeFollower);
  } catch (err) {
    next(err);
  }
};
const getnotFollowingUsers = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const randomUsers = await userModel.aggregate([
      {
        $match: {
          _id: { $nin: [...user.followings, ...user.followers, user._id] },
        },
      },
      { $sample: { size: 10 } }, // Get a random sample of 10 users
    ]);

    res.status(200).json(randomUsers);
  } catch (err) {
    next(err);
  }
};

const updateLikes = async (req, res, next) => {
  try {
    // console.log(req.params.id); //post id
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "You can only update your own post"));
    }

    if (req.body.like && user.likes.includes(req.params.id)) {
      return next(errorHandler(400, "Bad request"));
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          likes: req.body.like
            ? [...user.likes, req.params.id]
            : user.likes.filter((id) => id.toString() !== req.params.id),
        },
      },
      { new: true }
    );

    res.status(200).json({ likesLength: updatedUser.likes.length });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  test,
  updateUser,
  getUser,
  updateFollow,
  updateSaved,
  getSavedPosts,
  removeFollower,
  getnotFollowingUsers,
  getUserById,
  updateLikes,
};
