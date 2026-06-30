const express = require('express');
const router = express.Router();
const { authUser } = require('../middleware/auth.middleware');
const { getStorageInfo } = require('../controllers/user.controller');

router.get('/storage', authUser, getStorageInfo);

module.exports = router;