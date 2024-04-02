const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
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
const updatePost = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return next(errorHandler(404, "Post not found, cannot update it"));
    }
    const updatedPost = await postModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    // console.log("in update post, req.body", req.body);
    await updatedPost.save();

    res.status(200).json("post updated successfully!");
  } catch (err) {
    next(err);
  }
};
const deletePost = async (req, res, next) => {
  console.log(req.params.id);

  const post = await postModel.findById(req.params.id);
  if (!post) {
    return next(errorHandler(404, "Post not found"));
  }

  if (req.user.id !== post.creator._id.toString()) {
    return next(errorHandler(404, "You can only delete your own post"));
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
    // console.log(req.params.id); // post id
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
  const post = await postModel.findById(req.params.id);
  if (!post) {
    return next(errorHandler(401, "Post not found"));
  }

  //or post.creator._id
  if (post.creator !== req.user.id) {
    return next(errorHandler(401, "You can only get your own post"));
  }
  try {
    await postModel
      .findById(req.params.id)
      .populate("creator")
      .populate("comments");
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
      .populate("comments")
      .sort({ createdAt: "desc" })
      .limit(20);
    res.status(200).json(recentPosts);
  } catch (err) {
    next(err);
  }
};

const getFollowingRecentPosts = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user)
      return next(errorHandler(404, "User not found, can not fetch data"));

    const recentPosts = await postModel
      .find({ creator: { $in: user.followings } }) // Find posts where the creator ID is in the 'following' array
      .populate("creator")
      .populate("comments")
      .sort({ createdAt: "desc" })
      .limit(20);

    res.status(200).json(recentPosts);
  } catch (err) {
    next(err);
  }
};

const getSearchPosts = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm;
    const posts = await postModel
      .find({
        caption: { $regex: searchTerm, $options: "i" },
      })
      .populate("creator")
      .populate("comments")
      .sort({ createdAt: "desc" })
      .limit(20);

    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createPost,
  deletePost,
  getPost,
  updatePost,
  updateLikes,
  getRecentPosts,
  getFollowingRecentPosts,
  getSearchPosts,
};
// .populate('userId');!!
