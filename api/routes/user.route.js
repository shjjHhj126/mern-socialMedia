const { test } = require("../controllers/user.controller");

const router = require("express").Router();
router.get("/test", test);
module.exports = router;
