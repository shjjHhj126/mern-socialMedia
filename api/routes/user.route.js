const {
  test,
  updateUser,
  getUser,
  updateSaved,
  updateFollow,
  getSavedPosts,
  removeFollower,
  getnotFollowingUsers,
} = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyToken");

const router = require("express").Router();
router.get("/test", test);
router.put("/update", verifyToken, updateUser);
router.get("/get", verifyToken, getUser);
router.put("/updateSaved/:id", verifyToken, updateSaved); //id=post id
router.put("/updateFollow/:id", verifyToken, updateFollow); //id=user id
router.get("/getSavedPosts", verifyToken, getSavedPosts);
router.put("/removeFollower/:id", verifyToken, removeFollower);
router.get("/getnotFollowingUsers", verifyToken, getnotFollowingUsers);
module.exports = router;
