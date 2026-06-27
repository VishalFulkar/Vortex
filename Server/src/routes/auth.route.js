const express = require("express")
const router = express.Router();
const { register, login, logout, getMe } = require("../controllers/auth.controller");
const { authUser } = require("../middleware/auth.middleware")

router.post("/register", register);
router.post("/login", login)
router.post("/logout", authUser, logout)
router.get("/me", authUser, getMe)

module.exports = router;