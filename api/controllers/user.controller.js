const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const errorHandler = require("../utils/error");

const test = (req, res) => {
  res.status(200).send("api route is working");
};
const savePost = async (req, res, next) => {
  try {
    //make sure post exist
    const post = await postModel.findById(req.params.id);
    if (!post)
      return next(errorHandler(404, "post not found, cannot save the post"));

    console.log(post);
    //make sure user exist
    const user = await userModel.findById(post.creator);
    if (!user) {
      return next(
        errorHandler(404, "user not found, cannot save the post to the user")
      );
    }

    user.saved.push(req.params.id);
    await user.save();
  } catch (err) {
    next(err);
  }
};
const unsavePost = async (req, res, next) => {
  try {
    //make sure post exist
    const post = await postModel.findById(req.params.id);
    if (!post)
      return next(errorHandler(404, "post not found, cannot save the post"));

    //make sure user exist
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return next(
        errorHandler(404, "user not found, cannot save the post to the user")
      );
    }

    user.saved = user.saved.filter(
      (savedPostId) => savedPostId !== req.params.id
    );
    await user.save();
  } catch (err) {
    next(err);
  }
};
module.exports = { test, savePost, unsavePost };
