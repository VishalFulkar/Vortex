const express = require("express")
const router = express.Router();
const { register } = require("../controllers/auth.controller");
const { authUser } = require("../middleware/auth.middleware");

router.post("/register",authUser, register);

module.exports = router;