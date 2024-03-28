const postModel = require("../models/post.model");
const mongoose = require("mongoose");
const userModel = require("../models/user.model");

const createPost = async (req, res, next) => {
  try {
    const newPost = new postModel(req.body);
    await newPost.save();

    // add the new post into user data
    const creator = await userModel.findById(req.body.creator);
    creator.posts.push(newPost._id);
    await creator.save();

    res.status(201).json("post created successfully!");
  } catch (err) {
    next(err);
  }
};
const deletePost = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(errorHandler(401, "Post not found"));
  }
  const post = await postModel.findById(req.params.id);
  if (req.user.id !== post.userId) {
    return next(errorHandler(401, "You can only delete your own post"));
  }

  try {
    // delete the post ref in user's data!
    await userModel.findByIdAndUpdate(post.creator, {
      $pull: { posts: post._id },
    });

    // then delete the post
    await postModel.findByIdAndDelete(req.params.id);

    res.status(200).json("Post has been deleted");
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(errorHandler(401, "Post not found"));
  }
  if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
    return next(errorHandler(401, "You can only update your own post"));
  }

  const updatedPost = await postModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedPost);
};

const getPost = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(errorHandler(401, "Post not found"));
  }
  const post = await postModel.findById(req.params.id);
  if (post.userId !== req.user.id) {
    return next(errorHandler(401, "You can only get your own post"));
  }
  try {
    await postModel.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

const getRecentPosts = async (req, res, next) => {
  try {
    const recentPosts = await postModel
      .find()
      .populate("creator")
      .sort({ createdAt: "desc" })
      .limit(20);
    res.status(200).json(recentPosts);
  } catch (err) {
    next(err);
  }
};

const updateLikes = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return next(
        errorHandler(404, "Post not found, cannot update like status")
      );
    }

    const user = await userModel.findById(req.user.id);
    const alreadyLiked = post.likes.includes(post._id);

    if (req.body.like && !alreadyLiked) {
      post.likes.push(req.user.id);
      user.likes.push(post._id);
    } else if (!req.body.like && alreadyLiked) {
      post.likes = post.likes.filter((id) => id !== req.user);
      user.likes = user.likes.filter((id) => id !== post._id);
    }

    await post.save();

    res.status(200).json({ message: "Likes updated successfully", post });
  } catch (error) {
    // Handle errors
    next(error);
  }
};

module.exports = {
  createPost,
  deletePost,
  getPost,
  updatePost,
  getRecentPosts,
  updateLikes,
};
// .populate('userId');!!
