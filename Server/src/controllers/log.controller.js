const logModel = require("../models/log.model")

const getActivityLogs = async (req, res) => {
    const userId = req.user.id;

    try {
        const logs = await logModel.findByUser(userId);
        res.status(200).json({
            success: true,
            logs
        })
    }
    catch (error) {
        console.error('getActivityLogs error:', error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
}

const getFileActivityLogs = async (req, res) => {
    const { fileId } = req.params;
    const userId = req.user.id;
    if (!fileId) {
        return res.status(400).json({
            success: false,
            error: 'fileId is required'
        });
    }

    try {
        const logs = await logModel.findByFile(fileId, userId);
        res.status(200).json({
            success: true,
            logs
        });
    }
    catch (error) {
        console.error('getFileActivityLogs error:', error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
}

module.exports = { getActivityLogs, getFileActivityLogs }