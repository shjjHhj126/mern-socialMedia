const router = require("express").Router();
const {
  signup,
  login,
  logout,
  deleteAccount,
} = require("../controllers/auth.controller");
//sign up
router.post("/signup", signup);

//log in
router.post("/login", login);

//log out
router.get("/logout", logout);

//delete account
router.delete("/delete/:id", deleteAccount);
module.exports = router;
