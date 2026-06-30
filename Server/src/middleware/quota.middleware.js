const fileModel = require('../models/file.model');

// Pre-check using Content-Length header (before file is even saved to disk)
const checkQuotaBeforeUpload = async (req, res, next) => {
    const userId = req.user.id;
    const contentLength = parseInt(req.headers['content-length'] || '0');

    if (!contentLength) {
        return next(); // let multer handle missing file case
    }

    try {
        const withinQuota = await fileModel.checkQuota(userId, contentLength);
        if (!withinQuota) {
            return res.status(400).json({
                success: false,
                error: 'Storage quota exceeded'
            });
        }
        next();
    } catch (error) {
        console.error('checkQuotaBeforeUpload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to verify storage quota'
        });
    }
};

module.exports = { checkQuotaBeforeUpload };