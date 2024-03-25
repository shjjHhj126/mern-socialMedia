const router = require("express").Router();
const { signup, login } = require("../controllers/auth.controller");
//sign up
router.post("/signup", signup);

//log in
router.post("/login", login);
module.exports = router;
