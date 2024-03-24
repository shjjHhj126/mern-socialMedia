const router = require("express").Router();
const { signup } = require("../controllers/auth.controller");
//sign up
router.post("/signup", signup);

//log in
module.exports = router;
