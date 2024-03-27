const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
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
    likes: {
      type: Array,
      default: [],
    },
    location: {
      type: String,
      default: null,
    },
    tags: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
