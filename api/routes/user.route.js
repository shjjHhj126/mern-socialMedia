const {
  test,
  updateUser,
  getUser,
  follow,
  unfollow,
  updateSaved,
} = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyToken");

const router = require("express").Router();
router.get("/test", test);
router.put("/update", verifyToken, updateUser);
router.get("/get", verifyToken, getUser);
router.put("/updateSaved/:id", verifyToken, updateSaved); //id=post id
router.put("/follow/:id", verifyToken, follow); //id=user id
router.put("/unfollow/:id", verifyToken, unfollow); //id=user id
module.exports = router;
