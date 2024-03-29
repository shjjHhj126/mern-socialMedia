const router = require("express").Router();
const {
  createComment,
  deleteComment,
} = require("../controllers/comment.controller");
const verifyToken = require("../utils/verifyToken");

router.post("/create", verifyToken, createComment);
router.delete("/delete/:id", verifyToken, deleteComment);
// router.put("/update/:id", verifyToken, updateComment);
// no get: can directly get from post

module.exports = router;
