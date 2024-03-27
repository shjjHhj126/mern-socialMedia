const postModel = require("../models/post.model");
const mongoose = require("mongoose");

const createPost = async (req, res, next) => {
  try {
    console.log(req.body);
    const newPost = new postModel(req.body);
    await newPost.save();
    res.status(201).json("post created successfully!");
  } catch (err) {
    next(err);
  }
};
const deletePost = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Post not found" });
  }
  const post = await postModel.findById(req.params.id);
  if (req.user.id !== post.userId) {
    return next(errorHandler(401, "You can only delete your own post"));
  }

  try {
    await postModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Post has been deleted");
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404, "Post not found");
  }
  const post = await postModel.findById(req.params.id);
  if (post.userId !== req.user.id) {
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
    return res.status(404, "Post not found");
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
      .sort({ createdAt: "desc" })
      .limit(20);
    res.status(200).json(recentPosts);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createPost,
  deletePost,
  getPost,
  updatePost,
  getRecentPosts,
};
