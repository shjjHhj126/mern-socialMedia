const router = require("express").Router();
const verifyToken = require("../utils/verifyToken");
const {
  createPost,
  deletePost,
  getPost,
  updatePost,
  getRecentPosts,
  updateLikes,
  getLikes,
} = require("../controllers/post.controller");

router.post("/create", verifyToken, createPost);
router.delete("/delete/:id", verifyToken, deletePost);
router.get("/get/:id", verifyToken, getPost);
router.put("/update/:id", verifyToken, updatePost);
router.put("/updateLikes/:id", verifyToken, updateLikes);
router.get("/getRecentPosts", verifyToken, getRecentPosts);

module.exports = router;
