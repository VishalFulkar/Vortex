const express = require("express");
const router = express.Router();
const folderController = require("../controllers/folder.controller");
const { authUser } = require("../middleware/auth.middleware")

router.post("/", authUser, folderController.createFolder)
router.get("/", authUser, folderController.getFolders);
router.put("/:id/rename", authUser, folderController.renameFolder);

module.exports = router;