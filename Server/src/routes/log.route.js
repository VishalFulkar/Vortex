const express = require("express");
const { authUser } = require("../middleware/auth.middleware");
const logController = require("../controllers/log.controller")
const router = express.Router();

router.get("/", authUser, logController.getActivityLogs);
router.get("/file/:fileId", authUser, logController.getFileActivityLogs);

module.exports = router;