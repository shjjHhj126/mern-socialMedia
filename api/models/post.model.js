const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the userModel
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    images: {
      type: Array,
      validate: {
        validator: function (images) {
          return images.length > 0; // Ensure at least one image is present
        },
        message: "At least one image is required",
      },
      default: [],
      require: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    location: {
      type: String,
      default: null,
    },
    tags: {
      type: Array,
      default: [],
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
