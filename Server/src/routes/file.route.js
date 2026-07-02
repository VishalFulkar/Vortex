const express = require("express");
const router = express.Router();
const { authUser } = require("../middleware/auth.middleware")
const { checkQuotaBeforeUpload } = require('../middleware/quota.middleware');
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/file.controller');

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});


router.post('/upload', authUser,checkQuotaBeforeUpload, upload.single('file'), fileController.uploadFile);
router.get('/', authUser, fileController.getFiles);
router.get('/trash', authUser, fileController.getTrashedFiles);
router.get('/download/:id', authUser, fileController.downloadFile);
router.get('/view/:id', authUser, fileController.viewFile);
router.put('/:id/rename', authUser, fileController.renameFile);
router.patch('/:id/move', authUser, fileController.moveFile);
router.patch('/:id/restore', authUser, fileController.restoreFile);
router.delete('/:id', authUser, fileController.deleteFile);
router.delete('/:id/permanent', authUser, fileController.permanentDeleteFile);



module.exports = router;