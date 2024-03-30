const router = require("express").Router();
const verifyToken = require("../utils/verifyToken");
const {
  createPost,
  deletePost,
  getPost,
  updateLikes,
  getRecentPosts,
  getFollowingRecentPosts,
  getSearchPosts,
} = require("../controllers/post.controller");

router.post("/create", verifyToken, createPost);
router.delete("/delete/:id", verifyToken, deletePost);
router.get("/get/:id", verifyToken, getPost);
router.put("/updateLikes/:id", verifyToken, updateLikes);
router.get("/getRecentPosts", verifyToken, getRecentPosts);
router.get("/getFollowingRecentPosts", verifyToken, getFollowingRecentPosts);
router.get("/getSearchPosts", verifyToken, getSearchPosts);

module.exports = router;
