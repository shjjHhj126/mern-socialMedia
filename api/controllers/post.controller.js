const postModel = require("../models/post.model");
const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const errorHandler = require("../utils/error");

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
  const post = await postModel.findById(req.params.id);
  if (!post) {
    return next(errorHandler(401, "Post not found"));
  }
  if (req.user.id !== post.creator) {
    return next(errorHandler(401, "You can only delete your own post"));
  }

  try {
    // delete the post ref in user's data!
    await userModel.findByIdAndUpdate(post.creator, {
      $pull: { posts: post._id },
    });

    // delete the comments related to the post
    await commentModel.deleteMany({ post: post._id });

    // then delete the post
    await postModel.findByIdAndDelete(req.params.id);

    res.status(200).json("Post has been deleted");
  } catch (err) {
    next(err);
  }
};

const updateLikes = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "You can only update your own post"));
    }

    if (req.body.like && post.likes.includes(req.user.id)) {
      return next(errorHandler(400, "Bad request"));
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          likes: req.body.like
            ? [...post.likes, req.user.id]
            : post.likes.filter((id) => id.toString() !== req.user.id),
        },
      },
      { new: true }
    );

    res.status(200).json({ likesLength: updatedPost.likes.length });
  } catch (err) {
    next(err);
  }
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

// const updateLikes = async (req, res, next) => {
//   try {
//     const post = await postModel.findById(req.params.id);
//     if (!post) {
//       console.log("not found");
//       return next(
//         errorHandler(404, "Post not found, cannot update like status")
//       );
//     }

//     const user = await userModel.findById(req.user.id);
//     const alreadyLiked = post.likes.includes(req.user.id);
//     console.log("currently ", alreadyLiked ? "like" : "unlike");

//     if (req.body.like === alreadyLiked) {
//       return res.status(400).json({ message: "Invalid like status" });
//     }

//     if (req.body.like && !alreadyLiked) {
//       post.likes.push(req.user.id);
//       user.likes.push(post._id);
//     } else if (!req.body.like && alreadyLiked) {
//       post.likes = post.likes.filter((id) => {
//         id.toString() !== req.user.id;
//         console.log(typeof id.toString(), typeof req.user.id);
//       });
//       user.likes = user.likes.filter((id) => id !== post._id);
//     }
//     console.log(post.likes.length);

//     await post.save();
//     await user.save();

//     res.status(200).json({ message: "Likes updated successfully", post });
//   } catch (error) {
//     // Handle errors
//     next(error);
//   }
// };

module.exports = {
  createPost,
  deletePost,
  getPost,
  updateLikes,
  getRecentPosts,
};
// .populate('userId');!!
