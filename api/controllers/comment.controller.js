const errorHandler = require("../utils/error");
const commentModel = require("../models/comment.model");
const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");

const createComment = async (req, res, next) => {
  try {
    //make sure user id is correct
    const user = await userModel.findById(req.body.author);
    if (!user) {
      return next(errorHandler(404, "User not found, cannot updateLikes"));
    }

    //make sure post id is correct
    const post = await postModel.findById(req.body.post);
    if (!post) {
      return next(errorHandler(404, "Post not found, cannot updateLikes"));
    }

    const newComment = new commentModel(req.body);
    await newComment.save();

    //add new comment to the post data
    post.comments = [...post.comments, newComment._id]; //the wrong part
    await post.save();

    res.status(200).json(newComment);
  } catch (err) {
    next(err);
  }
};
const deleteComment = async (req, res, next) => {
  //make sure user id is correct
  if (!mongoose.Types.ObjectId.isValid(req.body.author)) {
    return next(errorHandler(404, "User not found, cannot updateLikes"));
  }
  //make sure post id is correct
  if (!mongoose.Types.ObjectId.isValid(req.body.post)) {
    return next(errorHandler(404, "Post not found, cannot updateLikes"));
  }

  const post = await postModel.findById(req.body.post);
  post.comments = post.comments.filter((id) => id != req.params.id);
  await post.save();

  await commentModel.findByIdAndDelete(req.params.id);
  res.status(200).json("successfully deleted comment");
};
// const updateComment = async (req, res, next) => {
//   //make sure user id is correct
//   if (!mongoose.Types.ObjectId.isValid(req.body.author)) {
//     return next(errorHandler(404, "User not found, cannot updateLikes"));
//   }
//   //make sure post id is correct
//   if (!mongoose.Types.ObjectId.isValid(req.body.post)) {
//     return next(errorHandler(404, "Post not found, cannot updateLikes"));
//   }

//   const updatedComment = await commentModel.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true }
//   );
//   res.status(200).json("successfully updated comment");
// };

module.exports = { createComment, deleteComment };
