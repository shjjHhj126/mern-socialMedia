const router = require("express").Router();
const verifyToken = require("../utils/verifyToken");
const { createPost } = require("../controllers/post.controller");

router.post("/post", verifyToken, createPost);

module.exports = router;
