const postModel = require("../models/post.model");
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
module.exports = { createPost };
