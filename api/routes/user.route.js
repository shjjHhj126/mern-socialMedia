const {
  test,
  savePost,
  unsavePost,
} = require("../controllers/user.controller");

const router = require("express").Router();
router.get("/test", test);
router.post("/saved/:id", savePost);
router.post("/unsaved/:id", unsavePost);
module.exports = router;
