const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User model
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // Reference to the Post model
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
