const userModel = require('../models/user.model');

const getStorageInfo = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId);
        const percentUsed = ((user.storage_used / user.storage_quota) * 100).toFixed(1);

        res.status(200).json({
            success: true,
            storage: {
                used: parseInt(user.storage_used),
                quota: parseInt(user.storage_quota),
                percentUsed: parseFloat(percentUsed),
                remaining: parseInt(user.storage_quota) - parseInt(user.storage_used)
            }
        });
    }
    catch (error) {
        console.error('getStorageInfo error:', error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
};

module.exports = { getStorageInfo }