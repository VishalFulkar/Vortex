const express = require("express")
const shareController = require("../controllers/share.controller")
const { authUser } = require("../middleware/auth.middleware")
const router = express.Router();

router.post('/:id/share', authUser, shareController.shareFile);
router.get('/:id/shares', authUser, shareController.getFileShares);
router.get('/shared-with-me', authUser, shareController.getSharedWithMe);
router.get('/my-shares', authUser, shareController.getMyShares);
router.delete('/:id/share/:userId', authUser, shareController.revokeShare);

module.exports = router;