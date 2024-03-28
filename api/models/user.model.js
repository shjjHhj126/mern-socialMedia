const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "anonymous",
      min: 3,
      max: 20,
    },
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
