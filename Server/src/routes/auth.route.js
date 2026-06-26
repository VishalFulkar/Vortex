const express = require("express")
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { authUser } = require("../middleware/auth.middleware");

router.post("/register", authUser, register);
router.post("/login", authUser, login)

module.exports = router;